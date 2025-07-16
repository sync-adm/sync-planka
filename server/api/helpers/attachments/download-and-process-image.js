const https = require('https');
const http = require('http');
const url = require('url');
const mime = require('mime');
const sharp = require('sharp');

const filenamify = require('../../../utils/filenamify');

module.exports = {
  inputs: {
    imageUrl: {
      type: 'string',
      required: true,
    },
    filename: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    return new Promise((resolve, reject) => {
      // Seguir até 3 redirects
      let redirectCount = 0;
      const maxRedirects = 3;

      const downloadImage = (currentUrl) => {
        if (redirectCount > maxRedirects) {
          reject(new Error('Muitos redirects'));
          return;
        }

        const currentParsedUrl = url.parse(currentUrl);
        const currentProtocol = currentParsedUrl.protocol === 'https:' ? https : http;

        const request = currentProtocol.get(currentUrl, (response) => {
          // Seguir redirects
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            redirectCount += 1;
            downloadImage(response.headers.location);
            return;
          }

          if (response.statusCode !== 200) {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            return;
          }

          // Verificar se é realmente uma imagem
          const contentType = response.headers['content-type'];
          if (!contentType || !contentType.startsWith('image/')) {
            reject(new Error(`Tipo de conteúdo inválido: ${contentType}`));
            return;
          }

          const chunks = [];
          let totalSize = 0;
          const maxSize = 10 * 1024 * 1024; // 10MB máximo

          response.on('data', (chunk) => {
            chunks.push(chunk);
            totalSize += chunk.length;

            if (totalSize > maxSize) {
              request.destroy();
              reject(new Error('Arquivo muito grande'));
            }
          });

          response.on('end', async () => {
            try {
              const buffer = Buffer.concat(chunks);
              const processedData = await this.processImageBuffer(
                buffer,
                inputs.filename,
                contentType,
              );
              resolve(processedData);
            } catch (error) {
              reject(error);
            }
          });

          response.on('error', (error) => {
            reject(error);
          });
        });

        request.on('error', (error) => {
          reject(error);
        });

        request.setTimeout(30000, () => {
          request.destroy();
          reject(new Error('Timeout ao baixar imagem'));
        });
      };

      downloadImage(inputs.imageUrl);
    });
  },

  async processImageBuffer(buffer, originalFilename, contentType) {
    const fileManager = sails.hooks['file-manager'].getInstance();

    // Criar referência do arquivo
    const { id: fileReferenceId } = await FileReference.create().fetch();
    const dirPathSegment = `${sails.config.custom.attachmentsPathSegment}/${fileReferenceId}`;

    // Gerar nome do arquivo seguro
    const filename = filenamify(originalFilename);

    // Obter informações do arquivo
    const mimeType = contentType || mime.getType(filename) || 'image/jpeg';
    const sizeInBytes = buffer.length;

    // Salvar arquivo original
    await fileManager.save(`${dirPathSegment}/${filename}`, buffer, 'application/octet-stream');

    const data = {
      fileReferenceId,
      filename,
      mimeType,
      sizeInBytes,
      encoding: null,
      image: null,
    };

    // Processar imagem com Sharp (similar ao process-uploaded-file.js)
    if (!['image/svg+xml', 'application/pdf'].includes(mimeType)) {
      try {
        let image = sharp(buffer, {
          animated: true,
        });

        const metadata = await image.metadata();

        if (metadata) {
          let { width, pageHeight: height = metadata.height } = metadata;
          if (metadata.orientation && metadata.orientation > 4) {
            [image, width, height] = [image.rotate(), height, width];
          }

          const thumbnailsPathSegment = `${dirPathSegment}/thumbnails`;
          const thumbnailsExtension = metadata.format === 'jpeg' ? 'jpg' : metadata.format;

          try {
            // Criar thumbnail 360px
            const outside360Buffer = await image
              .resize(360, 360, {
                fit: 'outside',
                withoutEnlargement: true,
              })
              .png({
                quality: 75,
                force: false,
              })
              .toBuffer();

            await fileManager.save(
              `${thumbnailsPathSegment}/outside-360.${thumbnailsExtension}`,
              outside360Buffer,
              'application/octet-stream',
            );

            // Criar thumbnail 720px
            const outside720Buffer = await image
              .resize(720, 720, {
                fit: 'outside',
                withoutEnlargement: true,
              })
              .png({
                quality: 75,
                force: false,
              })
              .toBuffer();

            await fileManager.save(
              `${thumbnailsPathSegment}/outside-720.${thumbnailsExtension}`,
              outside720Buffer,
              'application/octet-stream',
            );

            data.image = {
              width,
              height,
              thumbnailsExtension,
            };
          } catch (thumbnailError) {
            sails.log.warn('Erro ao criar thumbnails:', thumbnailError.stack);
            await fileManager.deleteDir(thumbnailsPathSegment);
          }
        }
      } catch (imageError) {
        sails.log.warn('Erro ao processar imagem:', imageError.stack);
      }
    }

    return data;
  },
};
