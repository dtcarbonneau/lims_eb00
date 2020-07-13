import React, {cloneElement} from 'react';
import { useCreateController, SimpleForm } from 'react-admin';

const SamplesCreate = props => {
    const {
        basePath, // deduced from the location, useful for action buttons
        defaultTitle, // the translated title based on the resource, e.g. 'Create Post'
        record, // empty object, unless some values were passed in the location state to prefill the form
        redirect, // the default redirection route. Defaults to 'edit', unless the resource has no edit view, in which case it's 'list'
        resource, // the resource name, deduced from the location. e.g. 'posts'
        save, // the create callback, to be passed to the underlying form as submit handler
        saving, // boolean that becomes true when the dataProvider is called to create the record
        version, // integer used by the refresh feature
    } = useCreateController(props);
    return (
        <div>
            <h1>{defaultTitle}</h1>
            {cloneElement(props.children, {
                basePath,
                record,
                redirect,
                resource,
                save,
                saving,
                version,
            })}
        </div>
    );
}
export default SamplesCreate;
