import React, {Fragment} from 'react';
import { Filter, List, Datagrid, TextField, EmailField, ReferenceField, Resource,
        ReferenceInput, SelectInput, NumberField, DateField, EditButton,
        Edit, SimpleForm, TextInput, DateInput, NumberInput, BulkDeleteButton, Create,
        FormDataConsumer, Toolbar, SaveButton, required, PasswordInput } from 'react-admin';


export const FreezersList = props => (
    <List {...props} bulkActionButtons={false}>
        <Datagrid>
            <TextField source="id" label="ID" />
            <TextField source="f_name" label="Storage Unit Name"/>
            <TextField source="temperature" label="Temperature"/>
            <TextField source="status" label="Status"/>
            <TextField source="location" label="Location"/>
            <TextField source="temp_name" label="Temp Name"/>
        </Datagrid>
    </List>
);
