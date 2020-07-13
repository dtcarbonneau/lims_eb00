import React, { createElement } from 'react';
import { Layout } from 'react-admin';
import MyMenu from './Menu';

const MyLayout = (props) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
