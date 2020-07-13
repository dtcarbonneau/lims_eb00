import React, { Fragment, useState, useEffect } from 'react';
import {
    Button,
    Confirm,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    SimpleForm,
    NumberInput,
    ReferenceInput,
    SelectInput,
    useDataProvider,
    Loading,
    Error
} from 'react-admin';
import {Dialog, DialogTitle, DialogContent} from '@material-ui/core';
import dataProvider from './limsDataProvider'

const ShipSamplesButton = (props) => {
    const selectedIds = props.selectedIds;
    const [open, setOpen] = useState(false);
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();


    // getList('get_avail_store',
    //   {filter: {"myCustomAttr": props.dups, "ids": props.storageIds},
    //   pagination: {page: 1, perPage: 25},
    //   sort: {field: "id", order: "DESC"}})


    // const [updateMany, { loading }] = useUpdateMany(
    //     'samples',
    //     selectedIds,
    //     { ss_id: status },
    //     {
    //         onSuccess: () => {
    //             refresh();
    //             notify('Samples updated');
    //             unselectAll('samples');
    //         },
    //         onFailure: error => notify('Error: samples not updated', 'warning'),
    //     }
    // );
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);


    const handleConfirm = (props) => {
        console.log(selectedIds);
        const status = props.ss_id;
        dataProvider.
          updateMany('samples',
            { ids: selectedIds, data: {'ss_id': status}})
          .catch((e) => {
            notify('Error: comment not approved', 'warning')
          })
          .then(refresh())
          .then(unselectAll('samples'))
          .then(notify('Samples updated', 'success'));
        setOpen(false);
    };

    return (
        <Fragment >
            <Button label="Ship Samples" onClick={handleClick} />
            <Dialog {...props} open={open} onClose={handleDialogClose}>
              <DialogTitle>Update Status of Samples</DialogTitle>
              <DialogContent>
                <SimpleForm {...props} save={handleConfirm}>
                  <ReferenceInput source="ss_id" reference="s_status">
                      <SelectInput optionText="ss_name" />
                  </ReferenceInput>
                </SimpleForm>
              </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default ShipSamplesButton;
//
// <Confirm
//     isOpen={open}
//     loading={loading}
//     title="Ship Samples"
//     content="Are you sure you want to Ship These Samples?"
//     onConfirm={handleConfirm}
//     onClose={handleDialogClose}
// >
