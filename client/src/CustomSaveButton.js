import * as React from 'react';
import { useCallback,  useState, useEffect} from 'react';
import {
    useRefresh,
    SaveButton,
    Toolbar,
    useCreate,
    useRedirect,
    useNotify,
    useUnselectAll,
    useDataProvider,
    Loading,
    Error,
    showNotification
} from 'react-admin';
// import dataProvider from './limsDataProvider'

const CustomSaveButton = props => {

    const unselectAll = useUnselectAll();
    const dataProvider = useDataProvider();
    const redirectTo = useRedirect();
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const notify = useNotify();
    const { basePath } = props;
    const refresh = useRefresh();

    const makeStorage = (store_start,dups) => {
      console.log(store_start);
      //stor_start is an array of record objects returned from the dataProvider
      //copier takes a first_cell element and copies it slot_size times and also add an array of sequential integers
      //to represent filling order
      const copier = (acc, cur) => acc.concat([[Array(cur['slot_size']).fill(cur['first_cell']),Array.from(Array(cur['slot_size']).keys())]]);
      const store_start1 = store_start.reduce(copier,[]);
      console.log(store_start1);
      //tuppler takes separate first_cell and sequenetial integer arrays and combines into a tupple-like structure. It also flattens
      //out the id dimension of the array
      const tuppler = (acc, cur) => acc.concat(cur[0].map((s,index) => [s,cur[1][index]]));
      const store_start2 = store_start1.reduce(tuppler,[]);

      //r_c_calc detemines row and column values consistent with the sequence order of the cell and
      //updates the first_cell value accordingly
      const r_c_calc = (dups) => {
        //we need to pass an extra parameter to the map function so we return a function taking dups as an argument
        return (a)=>{
          let samples = Math.floor(a[1]/dups);
          let batches= Math.floor(samples/10);
          let col = Math.floor(a[1]/dups)-batches*10;
          //the parseInt term adds the starting row which may not be zero
          let row= a[1]%dups + Math.floor(samples/10)*dups + parseInt(a[0].substring(13,14));
          return a[0].substring(0,13)+row+col;
        }
      }
      return store_start2.map(r_c_calc(dups));
    }

    const store_samples = (props, store_start) => {
       console.log(props.samp_list);
       console.log('props', props)

       //build aliquot list from samples using dups
       const samp_list = (props.samp_list.length>1) ? props.samp_list : props.samp_list[0].split(',');
       const aliquots = samp_list.reduce((acc, cur) => acc.concat(Array(props.dups).fill(cur)),[]);
       //bulid storage from start cell and slot size data
       const storage = makeStorage(store_start,props.dups);
       console.log(storage);
       console.log('samp_list',samp_list);
       console.log(' aliquots', aliquots);

       if (aliquots.length > storage.length){
         alert("Did not select enough storage!");
       }
       else{
         const als = aliquots.map((s,index) => [s, props.u_id, props.ss_id, props.p_id,
                                             props.date_cryo, props.date_exp, storage[index]])
        return als;
      }
     }


    const handleSave =
      useCallback((values) => {
      console.log('vals', values);
       dataProvider.getList('get_avail_store',
         {filter: {"myCustomAttr": values.dups, "ids": values.storageIds},
         pagination: {page: 1, perPage: 25},
         sort: {field: "id", order: "DESC"}})
         .then((store_start => dataProvider.
           createMany('samples',
           {'fields':['sa_name','u_id','ss_id','p_id', 'cryo_date', 'exp_date', 'loc'],
           'data':store_samples(values, store_start.data)})))
         .then(({ data }) => {
           console.log('usedataProvider', data);
           unselectAll('get_avail_store');
           redirectTo(`/samples?displayedFilters=%7B"p_id"%3Atrue%7D&filter=%7B"p_id"%3A${values.p_id}%7D`);
        })
        .catch((error) => {
          showNotification('Error: Problems with inserting', 'warning');
        })}, [redirectTo, refresh]);
    return <SaveButton {...props} onSave={handleSave} />;
};

export default CustomSaveButton;
