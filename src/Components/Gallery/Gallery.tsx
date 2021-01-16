import React, { useContext, useState, useEffect }  from 'react';
import {Editor} from '../../model';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { createClient, PhotosWithTotalResults, ErrorResponse, Photos } from 'pexels';
import './Gallery.css';
import PreviewImg from './PreviewImg';

const client = createClient('563492ad6f91700001000001f32c0c635f2c46e4badcbd278b68e104');

interface GalleryProps {
    //editor: Editor,
    //reference: any
    onOpenGalleryHandler: () => void,
}

function Gallery(props: GalleryProps) {


    enum Format {jpeg, png};
    let f = Format.jpeg;
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [previewsArr, fillPreviewsArr] = useState([]);

    let prewievsArray: any;
    function getPhotos(photos: PhotosWithTotalResults | ErrorResponse) {
        if("error" in photos) {
        } else {
            prewievsArray = photos.photos.map((photo, index) => {
                return (
                    <PreviewImg
                        key={index}
                        photo={photo}
                        mediumSrc={photo.src.medium}
                    />
                )
            })
        }
        fillPreviewsArr(prewievsArray);
    }
    
    const showMorePreiews = () => {
        setPage(page + 1);
    }

    const showPreviews = () => {
        if (query == '') return;
        client.photos.search({ query, per_page: 4, page: page}).then(photos => {
            getPhotos(photos);
        });
    }

    useEffect(() => {
        showPreviews();
    }, [page])

    return (
        <div className="pickImgContainer">
            <input
                placeholder="Поиск"
                onChange={e => {setQuery(e.target.value); setPage(1);}}
            ></input>
            <button onClick={showPreviews} className="pickImgContainer__searchButton">Найти</button>
            <div onClick={props.onOpenGalleryHandler} className="pickImgContainer__closeButton" />
            <div className="pickImgContainer__previewsContainer">
                {previewsArr}
            </div>
            <button
                onClick={showMorePreiews}
                className="pickImgContainer__morePreviewsButton"
            >Еще</button>
        </div>
    );
}

export default Gallery;