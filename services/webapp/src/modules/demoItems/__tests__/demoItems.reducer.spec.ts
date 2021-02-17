import { reducer, INITIAL_STATE as defaultState } from '../demoItems.reducer';
import { demoItemsActions } from '../index';
import { prepareState } from '../../../mocks/store';

describe('DemoItems: reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'unknown-action' };
    const resultState = reducer(undefined, action);
    expect(resultState).toEqual(defaultState);
  });

  it('should return state on unknown action', () => {
    const action = { type: 'unknown-action' };
    const resultState = reducer(defaultState, action);
    expect(resultState).toEqual(defaultState);
  });

  describe('setFavorite', () => {
    describe('with {isFavorite: true} parameter', () => {
      it('should add item to favorites', () => {
        const initialState = prepareState((state) => {
          state.demoItems.favorites = ['item-1', 'item-2'];
        }).demoItems;

        const action = demoItemsActions.setFavorite({ id: 'item-999', isFavorite: true });
        const resultState = reducer(initialState, action);
        expect(resultState).toEqual({
          ...initialState,
          favorites: ['item-1', 'item-2', 'item-999'],
        });
      });

      it('should not duplicate item if already is favorited', () => {
        const initialState = prepareState((state) => {
          state.demoItems.favorites = ['item-1', 'item-2', 'item-999'];
        }).demoItems;

        const action = demoItemsActions.setFavorite({ id: 'item-999', isFavorite: true });
        const resultState = reducer(initialState, action);
        expect(resultState).toEqual({
          ...initialState,
          favorites: ['item-1', 'item-2', 'item-999'],
        });
      });
    });

    describe('with {isFavorite: false} parameter', () => {
      it('should remove item from favorites', () => {
        const initialState = prepareState((state) => {
          state.demoItems.favorites = ['item-1', 'item-2', 'item-999'];
        }).demoItems;

        const action = demoItemsActions.setFavorite({ id: 'item-999', isFavorite: false });
        const resultState = reducer(initialState, action);
        expect(resultState).toEqual({
          ...initialState,
          favorites: ['item-1', 'item-2'],
        });
      });

      it('should do nothing if item is not favorited already', () => {
        const initialState = prepareState((state) => {
          state.demoItems.favorites = ['item-1', 'item-2'];
        }).demoItems;

        const action = demoItemsActions.setFavorite({ id: 'item-999', isFavorite: false });
        const resultState = reducer(initialState, action);
        expect(resultState).toEqual({
          ...initialState,
          favorites: ['item-1', 'item-2'],
        });
      });
    });
  });
});
