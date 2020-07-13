import React, {Component} from 'react';
import Child1 from './Child1';
import Child2 from './Child2';

class Parent extends Component{
    constructor(props){
        super(props);
        this.state={
            value_key:""
        }
    }
    parentFunction=(data_from_child)=>{
        this.setState({value_key:data_from_child});
    }
    render(){
        return(
            <div>
                <Child1 functionCallFromParent={this.parentFunction.bind(this)}/>
                <Child2 valueFromParent={this.state.value_key}/>
            </div>
        );
    }
}
export default Parent;
