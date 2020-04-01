const routes = {
  "categories": {
    url: '/categories',
    "getAllButEmpty": {
      url: ''
    },
    "getAll": {
      url: '/all'
    },
    "priceLevels": {
      url: '/{categoryId}/levels'
    },
    "markupGroups": {
      url: '/markup_groups'
    }
  },
  "items": {
    url: '/items',
    "getAll": {
      url: ''
    },
    "byId": {
      url: '/by_id'
    },
    "filtered": {
      url: '/search'
    },
    "availableFilters" : {
      url: '/filters'
    }
  },
  "cart": {
    url: '/cart',
    "add": {
      url: '/add'
    },
    "full": {
      url: '/full'
    },
    "update": {
      url: '/update'
    },
    "checkCount": {
      url: "/check_count"
    },
    "truncate": {
      url: "/truncate"
    },
    "updateData": {
      url: '/update_data'
    },
    "downloadPrice": {
      url: '/download_price'
    },
    "uploadCart": {
      url: '/upload_cart'
    }
  },
  "manager": {
    url: '/manager',
    'cart': {
      url: '/cart',
      'commit': {
        url: '/commit'
      }
    },
    'specs': {
      url: '/specs',
      'create': {
        url: '/create'
      },
      'update': {
        url: '/{specId}/update'
      }
    }
  }
};

export default function (name, appendix, base) {
  let _base = (base != undefined) ? base : '/api';
  let _name = '';
  if (typeof name === 'string')
    _name = name;
  else if (typeof name === 'object') {
    _name = name.name;
  }
  const paths = _name.split('.');
  let currentRouteTree = routes;
  let res = _base;

  for (let i = 0, len = paths.length; i < len; ++i) {
    const path = paths[i];
    if (!currentRouteTree.hasOwnProperty(path)) {
      throw `[Reverse route]: Cannot generate url. Unexpected ${path} in ${_name}`;
    }
    const routeTree = currentRouteTree[path];
    res += routeTree.url || "";
    currentRouteTree = routeTree;
  }

  if (typeof name === 'object') {
    let keys = Object.getOwnPropertyNames(name).filter(x => x !== 'name');
    for(let i = 0; i < keys.length; ++i) {
      if (res.indexOf(keys[i]) < 0) {
        console.error(`[Reverse route]: Undefined variable replacement {${keys[i]}} in "${res}"`);
      }
      res = res.replace(`{${keys[i]}}`, name[keys[i]]);
    }
  }

  let appToAdd = "";
  if (appendix) {
    if (typeof appendix === 'string' && appendix.startsWith('?'))
      appToAdd = appendix;
    else
      appToAdd = "/" + appendix;
  }
  return res + appToAdd;
}
