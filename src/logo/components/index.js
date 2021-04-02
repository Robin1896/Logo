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
        height:[],
        width:[],
        afstandLinksOnder:[],
    };
    this.imageRef = React.createRef()
    this.onImgLoad = this.onImgLoad.bind(this);
    }

    handleDownload = e => {
        this.setState({
            downloadvalue : e.target.value
        });
    }

    
    onImgLoad = ({target: img}) => {
       this.setState({height: img.offsetHeight, width: img.offsetWidth})
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
    pythagorean(sideA, sideB) {
        return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
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

            var x1object = object[0].x;
            var y1object = object[1].y;
            var x2object = object[1].x;
            var y2object = object[2].y;
            var objectx = (x2object - x1object)
            var objecty = (y2object - y1object )
            console.log("breedte is" + objectx)
            console.log("hoogte is" + objecty)
            console.log()
            const afstandLinksOnder = this.pythagorean(this.state.height - objecty - y1object, x1object )
            const width =  objectx;
            const height =  objecty;
            console.log(this.state.width)
            console.log(this.state.height)
            console.log("afstandtotlinksonder" + afstandLinksOnder)
            console.log("hoogte is" + (this.state.height - objecty - y1object))
            const hoogte = this.state.height - objecty - y1object;
            const breedte = x1object;
            const breedtePerc = Math.pow((breedte/this.state.width)*100, 2)
            const hoogtePerc = Math.pow((hoogte/this.state.width)*100, 2)
            console.log(Math.sqrt(breedtePerc + hoogtePerc ));
            const logo = <div style={{ borderStyle:"solid",  borderColor:"yellow", zIndex:10, height: height, width:width, position:"absolute", left: x1object, top:y1object}}></div>;

            this.setState({
                logo : logo,
                afstandLinksOnder : afstandLinksOnder,
                })

 

        }, (e) => {
        alert("foutje")
        });
    }

render() {
    console.log()
return (
<div className="rule-of-thirds">
    <div className="rule-of-thirds__image">
            {this.state.logo}
        <img ref={this.dimensions} onLoad={this.onImgLoad} src={this.state.base64} alt="afbeelding" />
        {"afstand tot linksonder tot logo:" }{this.state.afstandLinksOnder} PX
    </div>

    <button onClick={this.handleSubmit}>Save</button>
    <input className="filetest" type="file" onChange={(e)=> {
    this.uploadImage(e);
    }} />
</div>
)};

};

export default RuleOfThirds;