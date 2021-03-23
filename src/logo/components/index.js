import { yellow } from '@material-ui/core/colors';
import React from 'react';
import '../styles/main.scss';
// import fire from './fire';

const vision = require('react-cloud-vision-api');
vision.init({auth: 'AIzaSyAdJBBzi66kjNNwvPjCKcWBHpnR68IbIj8'});

class RuleOfThirds extends React.Component {

    constructor(props) {
    super(props);
    this.dimensions = React.createRef()
    this.state = {
        object : [],
        x1:[],
        y1: [],
        x2:[],
        y2: [],
        x3:[],
        y3: [],
        x4:[],
        y4: [],
        objectx: [],
        objecty: [],
        x1Perc: [],
        y1Perc: [],
        x2Perc: [],
        y2Perc: [],
        x3Perc: [],
        y3Perc: [],
        x4Perc: [],
        y4Perc: [],
        logo: [],
    };
    }

    handleDownload = e => {
        this.setState({
            downloadvalue : e.target.value
        });
    }

    handleView = f => {
        this.setState({
            viewvalue : f.target.value
        });
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) =>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (()=> {
                resolve(fileReader.result);
            });
            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({base64: base64, imageProps: file});
        this.apiRequest();
    }

    apiRequest() {      
        const req = new vision.Request({
        image: new vision.Image({
            base64: this.state.base64,
        }),
        features: [new vision.Feature('LOGO_DETECTION', 1),]
        })

        vision.annotate(req)
        .then((res) => {
            var object = res.responses[0].logoAnnotations[0].boundingPoly.vertices;
            console.log(object)
            var x1object = object[0].x;
            var y1object = object[1].y;
            var x2object = object[1].x;
            var y2object = object[2].y;
            var objectx = (x2object - x1object)
            var objecty = (y2object - y1object )
            console.log("breedte is" + objectx)
            console.log("hoogte is" + objecty)

            const width =  objectx;
            const height =  objecty;

            const logo = <div style={{ borderStyle:"solid",  borderColor:"yellow", zIndex:10, height: height, width:width, position:"absolute", left: x1object, top:y1object}}></div>;

            this.setState({
                logo : logo,
                // objecty : objecty,
                })

            this.gridDot();
            this.setDistance();

        }, (e) => {
        alert("foutje")
        });
    }

    gridDot() {
        this.setState({


        });
    }

    setDistance() {
        this.setState({

        })
    }



render() {
    
return (
<div className="rule-of-thirds">
    <div className="rule-of-thirds__image">
            {this.state.logo}
        <img ref={this.dimensions} src={this.state.base64} alt="afbeelding" />
    </div>

    <button onClick={this.handleSubmit}>Save</button>
    <input className="filetest" type="file" onChange={(e)=> {
    this.uploadImage(e);
    }} />
</div>
)};

};

export default RuleOfThirds;