import React from 'react';
import { Bed, Bath, Ruler } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
    image: string;
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    size: string | number;
    price: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    image,
    title,
    description,
    bedrooms,
    bathrooms,
    size,
    price,
}) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <Image
                src={image}
                width={1824}
                height={1080}
                alt={title}
                className="w-full h-48 object-cover transform transition duration-300"
            />
            <div className="p-4">
                {/* Price */}
                <span className="text-red-500 font-extrabold text-xl">
                    {price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}{' '}
                    <span className="text-zinc-800 font-thin text-sm">/ngày</span>
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-zinc-800">{title}</h3>

                {/* Description */}
                <p className="text-zinc-500 text-sm mb-4 font-medium">{description}</p>
                {/* Divider */}
                <hr className="border-t border-gray-300 my-4" />
                {/* Icons Section */}
                <div className="flex items-center space-x-4 mb-4">
                    {/* Bedrooms */}
                    <div className="flex items-center space-x-2">
                        <Bed className="h-5 w-5 text-red-500 transform transition duration-300 group-hover:scale-110 group-hover:text-red-700" />
                        <span className="text-gray-500">{bedrooms}</span>
                    </div>

                    {/* Bathrooms */}
                    <div className="flex items-center space-x-2">
                        <Bath className="h-5 w-5 text-red-500 transform transition duration-300 group-hover:scale-110 group-hover:text-red-700" />
                        <span className="text-gray-500">{bathrooms}</span>
                    </div>

                    {/* Size */}
                    <div className="flex items-center space-x-2">
                        <Ruler className="h-5 w-5 text-red-500 transform transition duration-300 group-hover:scale-110 group-hover:text-red-700" />
                        <span className="text-gray-500">{size} m²</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;