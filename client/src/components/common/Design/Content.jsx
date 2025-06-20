import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Table, Pagination } from 'semantic-ui-react';

import styles from './Design.module.scss';
import Fixed from '../Fixed';
import entryActions from '../../../entry-actions';
import selectors from '../../../selectors';
import { getElapsedTime } from '../../../utils/parse-time';

const Content = React.memo(() => {
  const dispatch = useDispatch();
  const cards = useSelector(selectors.selectDesignCards);
  const pagination = useSelector(selectors.selectDesignPagination);
  const isFetching = useSelector(selectors.selectDesignIsFetching);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      entryActions.fetchDesignNewRequests({
        page: currentPage,
        limit: 20,
        listNameContains: 'Solici',
        includeAllFields: false,
      }),
    );
  }, [dispatch, currentPage]);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  return (
    <div className={styles.content}>
      <Fixed />
      <div className={styles.container}>
        <h1>Solicitações Novas</h1>
        {isFetching ? (
          <Loader active />
        ) : (
          <>
            <Table celled>
              <Table.Header>
                <Table.Row className={styles.tableHeader}>
                  <Table.HeaderCell>Cliente</Table.HeaderCell>
                  <Table.HeaderCell>Solicitante</Table.HeaderCell>
                  <Table.HeaderCell className={styles.dateColumn}>
                    Data da Solicitação
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles.waitTimeColumn}>
                    Tempo em Espera
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles.requestColumn}>Solicitação</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cards &&
                  cards.map((card, index) => {
                    return (
                      <Table.Row
                        key={card.id}
                        className={index % 2 === 0 ? undefined : styles.isOdd}
                      >
                        <Table.Cell>{card.list?.board?.project?.name}</Table.Cell>
                        <Table.Cell>{card.creatorUser?.name}</Table.Cell>
                        <Table.Cell className={styles.dateColumn}>
                          {new Date(card.createdAt).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(card.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Table.Cell>
                        <Table.Cell className={styles.waitTimeColumn}>
                          {getElapsedTime(new Date(card.createdAt).toLocaleDateString())}
                        </Table.Cell>
                        <Table.Cell className={styles.requestColumn}>{card.name}</Table.Cell>
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table>
            <div className={styles.pagination_container}>
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  pointing
                  activePage={pagination.page}
                  totalPages={pagination.totalPages}
                  firstItem={null}
                  lastItem={null}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Content;
