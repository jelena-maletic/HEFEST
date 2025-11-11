import './ListElement.css'
import React, {useState} from 'react';

export function ListElement({screenState, listElementData, onClickFunc}) {
    const [isHovered, setIsHovered] = useState(false);
    const imagesLong = import.meta.glob('../../../assets/*.svg', {
        eager: true
    });

    const images = Object.entries(imagesLong).reduce((acc, [path, module]) => {
        let name = path.split('/').pop().replace(/\.svg/, '');
        acc[name] = module.default;
        return acc;
    }, {});

    return (
        <button className="list_element" onClick={() => {onClickFunc()}}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}>
            <img className="list_image" alt="List Image"
                 src={isHovered ?  images[`${screenState}-inverted`] : images[`${screenState}`]}/>
            <div className="list_element_info">
                <span className="list_element_title">{listElementData.title}</span>
                <span className="list_element_detail">{listElementData.detail}</span>
                <span className="list_element_subline">{listElementData.subline}</span>
            </div>
        </button>)
}