import { useIntl } from 'react-intl';
import favoriteIconFilled from '@iconify-icons/ion/star';
import favoriteIconOutlined from '@iconify-icons/ion/star-outline';
import { PreloadedQuery, UseQueryLoaderLoadQueryOptions, useFragment } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import { Routes } from '../../../app/config/routes';
import { useFavoriteDemoItem } from '../../../shared/hooks/useFavoriteDemoItem';
import { imageProps } from '../../../shared/services/contentful';
import { Icon } from '../../../shared/components/icon';
import { useGenerateLocalePath } from '../../../shared/hooks/localePaths';
import { demoItemListItem_item$key } from '../../../__generated__/demoItemListItem_item.graphql';
import { useFavoriteDemoItemListQuery } from '../../../__generated__/useFavoriteDemoItemListQuery.graphql';
import { Container, FavoriteIcon, Link, Thumbnail, Title } from './demoItemListItem.styles';

export type DemoItemListItemProps = {
  id: string;
  item: demoItemListItem_item$key | null;
  refreshFavorites: (options?: UseQueryLoaderLoadQueryOptions) => void;
  queryRef: PreloadedQuery<useFavoriteDemoItemListQuery>
};

export const DemoItemListItem = ({ id, item, refreshFavorites, queryRef }: DemoItemListItemProps) => {
  const intl = useIntl();
  const { setFavorite, isFavorite } = useFavoriteDemoItem(id, queryRef, refreshFavorites);
  const generateLocalePath = useGenerateLocalePath();

  const data = useFragment(
    graphql`
      fragment demoItemListItem_item on DemoItem {
        title
        image {
          title
          url
        }
      }
    `,
    item
  );

  return (
    <Container>
      <Link to={generateLocalePath(Routes.demoItem, { id })}>
        <FavoriteIcon
          role="checkbox"
          aria-checked={isFavorite}
          aria-label={intl.formatMessage({
            defaultMessage: 'Is favorite',
            description: 'Demo Item / Is favorite',
          })}
          onClick={(e) => {
            e.preventDefault();
            setFavorite(!isFavorite);
          }}
        >
          <Icon icon={isFavorite ? favoriteIconFilled : favoriteIconOutlined} />
        </FavoriteIcon>

        {data?.image && <Thumbnail {...imageProps(data.image, { size: { height: 50 } })} role="presentation" />}
        <Title>{data?.title}</Title>
      </Link>
    </Container>
  );
};
