import { LOAD_STATISTICS_SUCCESS, LOAD_STATISTICS } from '../actions';

const initialState = {
  mostPopularItems: [],
  mostUnpopularItems: [],
  mostActiveUsers: [],
  status: ''
};

export default function statistics(state = initialState, action) {
  switch (action.type) {
    case LOAD_STATISTICS:
      return {
        ...state,
        mostPopularItems: [],
        mostActiveUsers: [],
        mostUnpopularItems: [],
        status: LOAD_STATISTICS
      };
    case LOAD_STATISTICS_SUCCESS:
      return {
        ...state,
        mostPopularItems: action.mostPopularItems,
        mostActiveUsers: action.mostActiveUsers,
        mostUnpopularItems: action.mostUnpopularItems,
        status: LOAD_STATISTICS_SUCCESS
      };
    default:
      return state;
  }
}
