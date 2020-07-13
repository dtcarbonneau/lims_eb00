import React from "react";
import HeatMap from "react-heatmap-grid";
import {
    Button,
    Confirm,
    useQueryWithStore,
    Loading,
    Error,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    useInput,
    addField,
    TextInput
} from 'react-admin';

const BoxChart = props => {

  const proj_id = props.options;
  const status = 1;


  const {data, loading, error} = useQueryWithStore({
    type: 'getList',
    resource: 'boxsamples',
    payload: {filter: {"p_id": proj_id, "ss_id": status}, pagination: {page: 1, perPage: 1000}, sort: {field: "id", order: "DESC"}}
  });

  // Helper Function to identify unique entries of array
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  const xLabels = new Array(10).fill(0).map((_, i) => `${i}`);
  const yLabels =  new Array(10).fill(0).map((_, i) => `${i}`);

  // Find Unique Boxes
  let unique_boxes = [];
  if (data !== undefined){
    data.forEach(datum => unique_boxes.push(datum.loc.slice(0, 12)));
  }

  let boxNumbers = unique_boxes.filter(onlyUnique);
  console.log('box numbers', boxNumbers);
  const numberOfBoxes = boxNumbers.length;

  const heatMaps = [];

  for (let i = 0; i < numberOfBoxes; i++) {

    // Get samples in the right box
    let currentBox = boxNumbers[i];
    let currentSamples = []
    data.forEach(d => {if (d.loc.slice(0, 12) === currentBox){currentSamples.push(d)}})


    // Initialize empty box
    let empty_box = new Array(10);
    for (let i = 0; i < empty_box.length; i++) {
      empty_box[i] = new Array(10).fill(0);
    }

    // Initialize labels
    let labels = new Array(10);
    for (let i = 0; i < labels.length; i++) {
      labels[i] = new Array(10).fill("Empty");
    }

    let allProject = 0;

    // Place data in arrays
    for (const samp of currentSamples){
      let x = samp.loc.slice(-2,-1);
      let y = samp.loc.slice(-1);

      if (samp.p_id === proj_id){
        allProject += 1;
        empty_box[x][y] = 100;
        labels[x][y] = samp.sa_name;
      }
      else{
        empty_box[x][y] = 50;
        labels[x][y] = "Other Project";
      }
    }


    console.log('allProject', allProject);
    if (allProject === 100) {
    console.log('In the Check Cases');
    heatMaps.push(
      <div style={{fontSize: "13px"}} >
      <h3>Box Number {boxNumbers[i]}</h3>
        <HeatMap
          xLabels={xLabels}
          yLabels={yLabels}
          xLabelsLocation={"bottom"}
          xLabelWidth={60}
          data={empty_box}
          height={35}
          cellStyle={(background, value, min, max, data, x, y) => ({
            background: `rgb(0, 151, 230, 1)`,
            fontSize: "11.5px",
            color: "#444",
          })}
          cellRender={(v,y,x) => `${labels[x][y]}`}
        />
        &nbsp;
      </div>
    )
  }
  else {
        heatMaps.push(
        <div style={{fontSize: "13px"}} >
        <h3>Box Number {boxNumbers[i]}</h3>
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            xLabelsLocation={"bottom"}
            xLabelWidth={60}
            data={empty_box}
            height={35}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background:`rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
              fontSize: "11.5px",
              color: "#444",
            })}
            cellRender={(v,y,x) => `${labels[x][y]}`}
          />
          &nbsp;
        </div>
      )
    };
  };

    return (
      <div>
        {heatMaps}
      </div>

    );
}

export default BoxChart;
