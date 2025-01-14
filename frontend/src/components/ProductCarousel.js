import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'
//import AwesomeSlider from 'react-awesome-slider';
//import 'react-awesome-slider/dist/styles.css';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: '#000000'
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'contain', // Ensures the image fits within the area without cropping
  backgroundRepeat: 'no-repeat', // Prevents the image from repeating
  backgroundPosition: 'center', // Centers the image within the div
  height: '200px'
}

const ProductCarousel = () => {
  const slideImages = [
    { 
      url: "/images/rosine-banner.png",
      caption: 'Slide 1'
  },
  { 
      url: "/images/rosine-1.jpg",
      caption: 'Slide 1'
  },
  { 
    url: "/images/rosine-2.jpg",
    caption: 'Slide 1'
},
{ 
  url: "/images/rosine-3.jpg",
  caption: 'Slide 1'
},
{ 
  url: "/images/rosine-4.jpg",
  caption: 'Slide 4'
},
  ];
  return (
    <div className="slide-container">
    <Slide>
     {slideImages.map((slideImage, index)=> (
        <div key={index}>
          <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
            {/*<span style={spanStyle}>{slideImage.caption}</span>*/}
          </div>
        </div>
      ))} 
    </Slide>
  </div>
    )
}

export default ProductCarousel
