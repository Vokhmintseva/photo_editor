import React, { useContext, useState, useEffect }  from 'react';
import {Editor} from '../../model';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { createClient, PhotosWithTotalResults, ErrorResponse, Photos } from 'pexels';
import './Gallery.css';

const client = createClient('563492ad6f9170000100000123e4f93c5b6d44af8902722cfab6ce27');
//const query = 'Nature';

interface GalleryProps {
    //editor: Editor,
    //reference: any
}

function Gallery(props: GalleryProps) {

    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);      
    enum Format {jpeg, png};
    let f = Format.jpeg;
    const [query, setQuery] = useState('');
    
    const [arr, fillArr] = useState([]);

    let tinyPics: any;
    function getPhotos(photos: PhotosWithTotalResults | ErrorResponse) {
        if("error" in photos) {
        } else {
            tinyPics = photos.photos.map((photo, index) => {
                return (
                    <div className="card" key={index}>
                        <img src={photo.src.tiny} />
                    </div>
                )
            })
        }
        
            // while(tinyPics.length > 0) {
            //     tinyPics.pop();
            // }
        
        fillArr(tinyPics);
    }
    

    const openGallery = () => {
        client.photos.search({ query, per_page: 4}).then(photos => {
            getPhotos(photos);
        });
    }

    useEffect(() => {
        console.log('query is', query);
    })

    return (
        <div className="pickPhotosContainer">
            <label>Что будем искать?</label>
            <input
                onChange={e => setQuery(e.target.value)}
            ></input>
            <button
                className="searchPhotosButton"    
                onClick={openGallery}
            >Найти
            </button>
        
            <div className="tinyPicsContainer">
                {arr}
            </div>
        
        </div>
        
        
    );
}

export default Gallery;