import React, {Fragment} from 'react';
import { Filter, List, Datagrid, TextField, EmailField, ReferenceField, Resource,
        ReferenceInput, SelectInput, NumberField, DateField, EditButton,
        Edit, SimpleForm, TextInput, DateInput, NumberInput, BulkDeleteButton, Create,
        FormDataConsumer, Toolbar, SaveButton, required, PasswordInput } from 'react-admin';


const UserBulkActionButtons = props => (
  <Fragment/>
);
export const UserList = props => (
    <List {...props} bulkActionButtons={<UserBulkActionButtons />}>
        <Datagrid>
            <TextField source="id" label="ID"/>
            <TextField source="first_name" label="First Name"/>
            <TextField source="last_name" label="Last Name"/>
            <TextField source="email" label="Email"/>
            <TextField source="username" label="Username"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const UserCreate = props => (
    <Create {...props}>
        <SimpleForm>
          <TextInput source="first_name" label="First Name" validate={required('First Name is Required')}/>
          <TextInput source="last_name" label="Last Name"  validate={required('Last Name is Required')}/>
          <TextInput source="email" label="Email" validate={required('Email is Required')}/>
          <TextInput source="username" label="Username" validate={required('Username is Required')}/>
          <PasswordInput source="password" label="Password" validate={required('Password is Required')}/>
        </SimpleForm>
    </Create>
);

const UserEditToolbar = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);
export const UserEdit = props => (
    <Edit {...props}>
        <SimpleForm toolbar={<UserEditToolbar />} >
          <TextInput source="first_name" label="First Name" validate={required('First Name is Required')}/>
          <TextInput source="last_name" label="Last Name" validate={required('Last Name is Required')}/>
          <TextInput source="email" label="Email" validate={required('Email is Required')}/>
          <TextInput source="username" label="Username" validate={required('Username is Required')}/>
          <PasswordInput source="password" label="Password" validate={required('Password is Required')}/>
        </SimpleForm>
    </Edit>
);
