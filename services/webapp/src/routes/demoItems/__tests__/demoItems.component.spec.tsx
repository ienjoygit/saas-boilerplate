import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { makeContextRenderer, packHistoryArgs, spiedHistory } from '../../../shared/utils/testUtils';
import demoItemsAllQueryGraphql from '../../../__generated__/demoItemsAllQuery.graphql';
import favoriteDemoItemListQueryGraphql from '../../../__generated__/useFavoriteDemoItemListQuery.graphql';
import { demoItemFactory } from '../../../mocks/factories';
import { DemoItems } from '../demoItems.component';
import { fillCommonQueryWithUser } from '../../../shared/utils/commonQuery';

describe('DemoItems: Component', () => {
  const getRelayEnv = () => {
    const relayEnvironment = createMockEnvironment();
    fillCommonQueryWithUser(relayEnvironment);
    relayEnvironment.mock.queueOperationResolver((operation) =>
      MockPayloadGenerator.generate(operation, {
        DemoItemCollection() {
          return {
            items: [
              demoItemFactory({
                sys: { id: 'test-id-1' },
                title: 'First',
                image: { title: 'first image title', url: 'https://image.url' },
              }),
              demoItemFactory({
                sys: { id: 'test-id-2' },
                title: 'Second',
                image: { title: 'second image title', url: 'https://image.url' },
              }),
            ],
          };
        },
      })
    );
    relayEnvironment.mock.queueOperationResolver((operation) =>
      MockPayloadGenerator.generate(operation, {
        ContentfulDemoItemFavoriteType: () => ({ item: { pk: 'item-1' } }),
      })
    );
    relayEnvironment.mock.queuePendingOperation(demoItemsAllQueryGraphql, {});
    relayEnvironment.mock.queuePendingOperation(favoriteDemoItemListQueryGraphql, {});
    return relayEnvironment;
  };

  const component = () => <DemoItems />;
  const render = makeContextRenderer(component);

  it('should render all items', async () => {
    render({}, { relayEnvironment: getRelayEnv() });
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('should open single demo item page when link is clicked', async () => {
    const { pushSpy, history } = spiedHistory();
    render({}, { relayEnvironment: getRelayEnv(), router: { history } });
    expect(screen.getByText('First')).toBeInTheDocument();
    await userEvent.click(screen.getByText('First'));
    expect(pushSpy).toHaveBeenCalledWith(...packHistoryArgs('/en/demo-items/test-id-1'));
  });
});
