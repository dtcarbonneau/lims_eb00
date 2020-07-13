import React, { createElement } from 'react';
import { Admin, Resource, ListGuesser, EditGuesser, Login } from 'react-admin';
import dataProvider from './limsDataProvider';
import {SampleList, SampleEdit, SampleCreate} from './samples';
import {ProjectList, ProjectCreate, ProjectEdit} from './projects';
import {UserList, UserCreate, UserEdit} from './users';
import {FreezersList} from './freezers';
import customRoutes from './customRoutes';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';
import LabelIcon from '@material-ui/icons/Label';
import MyLayout from './MyLayout';
import {authProvider} from "./authProvider";

const MyLoginPage = () => (
    <Login
        // A random image that changes everyday
        backgroundImage='https://www.abveris.com/hs-fs/hubfs/antibody_whitebgrd.png?width=1200&name=antibody_whitebgrd.png'
    />
);

const App = () => (
      <Admin appLayout={MyLayout} customRoutes={customRoutes} dataProvider={dataProvider} loginPage={MyLoginPage} authProvider={authProvider}  >
        <Resource name="samples" list={SampleList} edit={SampleEdit} create={SampleCreate}/>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
        <Resource name="projects" list={ProjectList} edit={ProjectEdit} create={ProjectCreate} />
        <Resource name="freezers" list={FreezersList}/>
        <Resource name="s_status" />
        <Resource name="get_avail_store" />
      </Admin>
  );

export default App;
  
 