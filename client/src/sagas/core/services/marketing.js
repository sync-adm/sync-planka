import { call, put, select } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';
import ToastTypes from '../../../constants/ToastTypes';

export function* fetchMarketingCompletedRequests(data) {
  yield put(actions.fetchCompletedRequests());

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getCompletedRequests, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchCompletedRequestsSuccess(response));
  } catch (error) {
    yield put(actions.fetchCompletedRequestsFailure(error));
  }
}

export function* fetchEvolutionGroups(data) {
  yield put(actions.fetchEvolutionGroups(data));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getEvolutionGroups, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchEvolutionGroupsSuccess(response));
  } catch (error) {
    yield put(actions.fetchEvolutionGroupsFailure(error));
  }
}

export function* sendWhatsAppMessage(data) {
  yield put(actions.sendWhatsAppMessage(data));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.sendWhatsAppMessage, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.sendWhatsAppMessageSuccess(response));

    yield call(toast, {
      type: ToastTypes.GENERIC_TOAST,
      params: {
        type: 'success',
        title: 'Mensagem enviada!',
        message: 'A notificação foi enviada via WhatsApp com sucesso.',
        icon: 'check circle',
      },
    });
  } catch (error) {
    yield put(actions.sendWhatsAppMessageFailure(error));

    yield call(toast, {
      type: ToastTypes.GENERIC_TOAST,
      params: {
        type: 'error',
        title: 'Erro ao enviar mensagem',
        message:
          'Não foi possível enviar a notificação. Verifique a conexão do WhatsApp e tente novamente.',
        details: error.message || 'Erro desconhecido',
        icon: 'exclamation triangle',
      },
    });
  }
}

export default {
  fetchMarketingCompletedRequests,
  fetchEvolutionGroups,
  sendWhatsAppMessage,
};
