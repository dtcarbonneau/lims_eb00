import React, {Fragment} from 'react';
import { Filter, List, Datagrid, TextField, EmailField, ReferenceField, Resource,
        ReferenceInput, SelectInput, NumberField, DateField, EditButton,
        Edit, SimpleForm, TextInput, DateInput, NumberInput, BulkDeleteButton, Create,
        FormDataConsumer, SaveButton, Toolbar, required} from 'react-admin';

const ProjectBulkActionButtons = props => (
    <Fragment/>
);
export const ProjectList = props => (
    <List {...props} bulkActionButtons={<ProjectBulkActionButtons />}>
        <Datagrid>
            <TextField source="id" label="ID"/>
            <TextField source="p_name" label="Project"/>
            <ReferenceField source="u_id" reference="users" label="User">
                <TextField source="last_name" label="Technician" />
            </ReferenceField>
            <TextField source="t_name" label="Target Name" />
            <TextField source="samp_type" label="Sample Type" />
            <DateField source="inv_date" label="Inventory Date"/>
            <NumberField source="sto_terms" label="Storage Terms" />
            <EditButton/>
        </Datagrid>
    </List>
);
export const ProjectCreate = props => (
    <Create {...props}>
        <SimpleForm>
          <TextInput source="p_name" label="Project Name" validate={required('Project Name is Required')}/>
          <ReferenceInput source="u_id" reference="users" label="User" >
            <SelectInput optionText="last_name" validate={required('User is Required')} />
           </ReferenceInput>
          <TextInput source="t_name" label="Target Name" validate={required('Target is Required')}/>
          <TextInput source="samp_type" label="Sample Type" validate={required('Sample Type is Required')}/>
          <DateInput source="inv_date" label="Inventory Date" />
          <NumberInput source="sto_terms" label="Storage Terms" validate={required('Storage Terms Required')} />
        </SimpleForm>
    </Create>
);

const ProjectEditToolbar = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);

export const ProjectEdit = props => (
    <Edit {...props}>
        <SimpleForm toolbar={<ProjectEditToolbar />} >
          <TextInput source="p_name" label="Project Name"/>
          <ReferenceInput source="u_id" reference="users" label="User">
            <SelectInput optionText="last_name" />
           </ReferenceInput>
          <TextInput source="t_name" label="Target Name"/>
          <TextInput source="samp_type" label="Sample Type"/>
          <DateInput source="inv_date" label="Inventory Date" />
          <NumberInput source="sto_terms" label="Storage Terms" />
        </SimpleForm>
    </Edit>
);
