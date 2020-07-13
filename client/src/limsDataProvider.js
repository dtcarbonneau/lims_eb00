import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = '/api';
const httpClient = fetchUtils.fetchJson;

export default {
    getList: (resource, params) => {
          console.log("GETLIST CALLED");
          console.log('getlist params', params);
          const { page, perPage } = params.pagination;
          const { field, order } = params.sort;
          const query = {
              sort: JSON.stringify([field, order]),
              method: 'GET',
              range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
              filter: JSON.stringify(params.filter),
          };
          const url = `${apiUrl}/${resource}?${stringify(query)}`;
          return httpClient(url).then(({ headers, json }) => ({
              data: json,
              total: parseInt(headers.get("X-Total-Count"))
          }));
    },

    getOne: (resource, params) => {
        console.log("GETONE Called")
        const id_val = [parseInt(params.id)]
        const query = {
            filter: JSON.stringify({id: id_val}),
        };
        // console.log("GetOne", query);
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        // console.log("GETONE url", url);
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getMany: (resource, params) => {
        console.log("GETMANY Called");
        const query = {
            filter: JSON.stringify({id: params.ids}),
        };
        console.log(query);
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        console.log("getMany Reference called");
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: (resource, params) =>{
        console.log("UPDATE called");
        params.data['ids'] = [params.data.id]
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))},

    updateMany: (resource, params) => {
        console.log(params);
        params.data['ids'] = params.ids;

        return httpClient(`${apiUrl}/${resource}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>{
        console.log("CREATE called");
        console.log(params);
        return httpClient(`${apiUrl}/${resource}`, {
              method: 'POST',
              body: JSON.stringify(params.data),
              })
              .then(({ json }) => ({
                  data: { ...params.data, id: json.id },
              }))},

    createMany: (resource, params) =>{
        console.log("CREATE MANY called");
        console.log(params);
        return httpClient(`${apiUrl}/${resource}`, {
                method: 'POST',
                body: JSON.stringify(params.data),
                //headers: { "Content-Type": "application/json" }
                }).then(({ json }) => ({
                    data: { ...params.data, id: json.id },
                }))},

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        console.log('Delete Many Called');
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        console.log(query);
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
};
