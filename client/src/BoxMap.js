import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title, SimpleForm, SelectInput, ReferenceInput, FormDataConsumer} from 'react-admin';
import BoxChart from './BoxChart.js';

const BoxMap = (props) => (
    <Card {...props}>
        <Title title="Box Charts" />
        <CardContent {...props}>
          <SimpleForm save={()=> null} {...props}>
          <ReferenceInput source="p_id" reference="projects" label="Projects">
            <SelectInput optionText="p_name" />
          </ReferenceInput>
          <FormDataConsumer>
            {({ formData, ...rest }) =>
                formData.p_id &&
                <BoxChart options= {formData.p_id}/>
            }
            </FormDataConsumer>
          </SimpleForm>
        </CardContent>
    </Card>
);

export default BoxMap;
//
