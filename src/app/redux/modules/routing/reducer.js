import {connectRoutes} from 'redux-first-router';
import createHistory from 'history/createMemoryHistory';
import routesMap from './routes';

const history = createHistory();
const {reducer, middleware, enhancer} = connectRoutes(history, routesMap);

export {middleware, enhancer};

export default reducer;
