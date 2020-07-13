import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = '/api/login/';

export const authProvider = {
    login: ({ username, password }) =>  {
        const request = new Request(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" }
        });
        console.log('LOGIN CALLED', request);
        return fetch(request)
            .then(response => {
                console.log(response.status);
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                    // console.log(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                localStorage.setItem('token', token);
            });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        return Promise.resolve();
    },

    checkError: (error) => {
      const status = error.status;
      if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          return Promise.reject();
      }
      return Promise.resolve();
    },

    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    },

    checkAuth: () => localStorage.getItem('token')
        ? Promise.resolve()
        : Promise.reject(),
};
