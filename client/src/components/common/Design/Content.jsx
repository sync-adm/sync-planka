import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Table, Pagination } from 'semantic-ui-react';

import styles from './Design.module.scss';
import Fixed from '../Fixed';
import entryActions from '../../../entry-actions';
import selectors from '../../../selectors';

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
    <div className={classNames(styles.wrapper, styles.fullHeight)}>
      <Fixed />
      <div className={styles.container}>
        <h1>Solicitações Novas</h1>
        {isFetching ? (
          <Loader active />
        ) : (
          <>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Nome</Table.HeaderCell>
                  <Table.HeaderCell>Quadro</Table.HeaderCell>
                  <Table.HeaderCell>Projeto</Table.HeaderCell>
                  <Table.HeaderCell>Data de Criação</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cards &&
                  cards.map((card) => (
                    <Table.Row key={card.id}>
                      <Table.Cell>{card.name}</Table.Cell>
                      <Table.Cell>{card.list?.board?.name}</Table.Cell>
                      <Table.Cell>{card.list?.board?.project?.name}</Table.Cell>
                      <Table.Cell>{new Date(card.createdAt).toLocaleDateString()}</Table.Cell>
                    </Table.Row>
                  ))}
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
