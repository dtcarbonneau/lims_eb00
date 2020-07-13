// in src/users.js
import React, {Fragment} from 'react';
import { Filter, List, Datagrid, TextField, EmailField, ReferenceField,
        ReferenceInput, SelectInput, NumberField, DateField, EditButton,
        Edit, SimpleForm, TextInput, DateInput, NumberInput, BulkDeleteButton, Create} from 'react-admin';
import ShipSampButton from './ShipSampButton';
import InsertManyButton from './InsertMany';
import SelectLocationsButton from './SelectLocationsButton';

const SamplesBulkActionButton = props => (
    <Fragment>
        <SelectLocationsButton label="Select Locations" {...props} />
        {/* default bulk delete action */}
    </Fragment>
);

export const AvailStoreList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="freezer"/>
            <TextField source="rack"/>
        </Datagrid>
    </List>
);

// export const SampleCreate = props => (
//     <Create {...props}>
//         <SimpleForm>
//           <ReferenceInput source="u_id" reference="users" label="User">
//             <SelectInput optionText="last_name" />
//           </ReferenceInput>
//           <ReferenceInput source="ss_id" reference="s_status" label="Status">
//             <SelectInput optionText="ss_name" />
//           </ReferenceInput>
//           <ReferenceInput source="p_id" reference="projects" label="Projects">
//             <SelectInput optionText="p_name" />
//           </ReferenceInput>
//           <TextInput source="loc" label="Location"/>
//           <DateInput source="date_cryo" label="Cryo Date" />
//           <DateInput source="date_exp" label="Expiration Date"/>
//         </SimpleForm>
//     </Create>
// );

// export const SampleEdit = props => (
//     <Edit {...props}>
//         <SimpleForm>
//            <TextInput disabled source="id" />
//            <ReferenceInput source="p_id" reference="projects">
//               <SelectInput optionText="p_name" />
//            </ReferenceInput>
//             <ReferenceInput source="u_id" reference="users">
//                <SelectInput optionText="last_name" />
//             </ReferenceInput>
//             <TextInput source="loc" />
//         </SimpleForm>
//     </Edit>
// );
