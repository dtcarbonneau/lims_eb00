// in src/users.js
import React, {Fragment} from 'react';
import { Filter, List, Datagrid, TextField, EmailField, ReferenceField, Resource,
        ReferenceInput, SelectInput, NumberField, DateField, EditButton, Pagination,
        Edit, SimpleForm, TextInput, DateInput, NumberInput, BulkDeleteButton, Create,
        FormDataConsumer, Toolbar, SaveButton, required} from 'react-admin';
// import RichTextInput from 'ra-input-rich-text';
import ShipSampButton from './ShipSampButton';
import InsertSamplesButton from './SelectLocationsButton.js';
import { Field } from 'react-final-form';
import SaveFunction  from './SaveFunction';
import CustomSaveButton from './CustomSaveButton';
import SamplesCreate from './SamplesCreate';
//import InsertManyButton from './InsertMany';

const SamplesFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput label="Technician" source="u_id" reference="users">
            <SelectInput optionText="last_name" />
        </ReferenceInput>
        <ReferenceInput label="Project" source="p_id" reference="projects">
            <SelectInput optionText="p_name" />
        </ReferenceInput>
        <ReferenceInput label="Status" source="ss_id" reference="s_status">
            <SelectInput optionText="ss_name" />
        </ReferenceInput>
    </Filter>
);

const SamplesBulkActionButtons = props => (
    <Fragment>
        <ShipSampButton label="Ship Samples" {...props} />
        {/* default bulk delete action */}
        <BulkDeleteButton {...props} />
    </Fragment>
);

const InsertSamplesBulkActionButtons = props => (
    <Fragment>
        <InsertSamplesButton
            label="Choose Samples" {...props} component="input"/>
    </Fragment>
);



const SamplesCreateToolbar = (props, {record}) => (
    <Toolbar {...props}>
        <CustomSaveButton {...props} record={record}/>
    </Toolbar>
);

// Validate Form Entries (contents)
const validateSamplesInsert = (values) => {
    const errors = {};
    if (values.dups !== parseInt(values.dups, 10)) {
        errors.dups= ['Duplicate Number must be an Integer'];
    }
    return errors
};

//Simple Form
const manipulateSampleInput = (stringSamples) => {
    let samps = stringSamples.split(" ");
    return samps;
}

const slotsNeeded = (samps, dups) => {
  let s_list = (samps.length > 1) ? samps : samps[0].split(',');
  return(Math.ceil(s_list.length  / 10) * 10 * dups)
}

export const SampleCreate = props => (
      <SamplesCreate {...props}>
         <SimpleForm {...props} validate={validateSamplesInsert} toolbar={< SamplesCreateToolbar {...props} />}>
           <ReferenceInput source="u_id" reference="users" label="User" validate={required('User is Required')}>
             <SelectInput optionText="last_name" />
           </ReferenceInput>
           <ReferenceInput source="ss_id" reference="s_status" label="Status" validate={required('Status is Required')}>
             <SelectInput optionText="ss_name" />
           </ReferenceInput>
           <ReferenceInput source="p_id" reference="projects" label="Projects" validate={required('Project is Required')}>
             <SelectInput optionText="p_name" />
           </ReferenceInput>
           <NumberInput source="dups" label="Duplicate (Number of Copies)" validate={required('Duplicate Number is Required is Required (for no duplicates, write "1")')} />
           <FormDataConsumer>
             {({ formData, ...rest }) =>
                <TextInput
                  source="samp_list"
                  label="Sample List"
                  parse={samps => manipulateSampleInput(samps)}
                  validate={required('Sample is Required')}
                  // onChange={samps => neededStorage(samps, formData.dups)}
                  {...rest}
              />}
           </FormDataConsumer>
           <FormDataConsumer>
             {({ formData, ...rest }) =>
                 formData.dups &&
                 formData.samp_list &&
                <Fragment>
                  <p>
                    Slots needed for Storage: {slotsNeeded(formData.samp_list, formData.dups)}
                  </p>
              </Fragment>}
           </FormDataConsumer>
           <DateInput source="date_cryo" validate={required('Cryo Date is Required')} label="Cryo Date" />
           <DateInput source="date_exp" validate={required('Expiration Date is Required')} label="Expiration Date"/>
           <FormDataConsumer>
             {({ formData, ...rest }) =>
              formData.dups &&
              formData.samp_list &&
               <Resource
                source="locs"
                name="get_avail_store"
                list={AvailStoreList}
                options={{ myCustomAttr: formData.dups , sampleList: formData.samp_list, slectedIds: formData.storageIds}}
                {...rest}
             />}
          </FormDataConsumer>
         </SimpleForm>
       </SamplesCreate>
);

const SampleEditToolbar = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);
export const SampleEdit = props => (
    <Edit {...props}>
        <SimpleForm toolbar={<SampleEditToolbar/>}>
            <TextInput source="sa_name" label= "Sample Name" validate={required('Sample Name is Required')} />
            <ReferenceInput source="u_id" reference="users" label= "User Last Name">
              <SelectInput optionText="last_name" validate={required('User is Required')} />
            </ReferenceInput>
            <ReferenceInput source="ss_id" reference="s_status" label= "Status" >
              <SelectInput optionText="ss_name" validate={required('Status is Required')}/>
            </ReferenceInput>
            <ReferenceInput source="p_id" reference="projects" label="Project" >
              <SelectInput optionText="p_name" validate={required('Project is Required')}/>
            </ReferenceInput>
            <DateInput source="date_cryo" />
            <DateInput source="date_exp" />
        </SimpleForm>
    </Edit>
);

export const SampleList = props => (
    <List filters={<SamplesFilter/>} {...props} bulkActionButtons={<SamplesBulkActionButtons />} >
        <Datagrid>
            <TextField source="id" label="ID" />
            <TextField source="sa_name" label="Sample"/>
            <ReferenceField label="User" source="u_id" reference="users">
                <TextField source="last_name" label="Technician" />
            </ReferenceField>
            <ReferenceField label="Status" source="ss_id" reference="s_status">
                <TextField source="ss_name" label="Status" />
            </ReferenceField>
            <ReferenceField label="Project" source="p_id" reference="projects">
                <TextField source="p_name" label="Project" />
            </ReferenceField>
            <TextField source="loc" label="Location" />
            <DateField source="date_cryo" label="Cryo Date" />
            <DateField source="date_exp" label="Expiration Date"/>
            <EditButton/>
        </Datagrid>
    </List>
);


export const AvailStoreList = props => (
    <List {...props} bulkActionButtons={<InsertSamplesBulkActionButtons {...props} />} filter={{myCustomAttr: props.options.myCustomAttr, ids: []}}
    title="Available Storage">
        <Datagrid>
            <TextField source="id" />
            <TextField source="first_cell"/>
            <TextField source="slot_size"/>
        </Datagrid>
    </List>
);
