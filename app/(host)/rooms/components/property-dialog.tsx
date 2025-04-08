// "use client"

// import { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog"
// import { NormalizedProperty, PropertyStatus } from "@/lib/property/services/fetchProperty"
// import { FileText, ExternalLink } from "lucide-react"

// interface PropertyDialogProps {
//   property: NormalizedProperty
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// export function PropertyDialog({
//   property,
//   open,
//   onOpenChange,
// }: PropertyDialogProps) {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null)

//   // Format currency
//   const formatCurrency = (amount?: number, currency = "USD") => {
//     if (amount === undefined) return "N/A"
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency,
//     }).format(amount)
//   }

//   // Function to get file extension
//   const getFileExtension = (url: string) => {
//     const parts = url.split('.')
//     return parts[parts.length - 1].toLowerCase()
//   }

//   // Function to get file name from URL
//   const getFileName = (url: string) => {
//     const parts = url.split('/')
//     return parts[parts.length - 1]
//   }

//   // Check if document is an image
//   const isImageFile = (url: string) => {
//     const ext = getFileExtension(url)
//     return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
//   }

//   // Check if document is a PDF
//   const isPdfFile = (url: string) => {
//     return getFileExtension(url) === 'pdf'
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl">{property.name}</DialogTitle>
//           <DialogDescription className="flex items-center gap-2">
//             <span className="px-2 py-1 bg-gray-100 rounded text-sm">Property Code: {property.code}</span>
//             <span className={`px-2 py-1 rounded text-sm ${
//               property.status === PropertyStatus.AVAILABLE ? 'bg-green-100 text-green-700' : 
//               property.status === PropertyStatus.SOLD ? 'bg-red-100 text-red-700' : 
//               property.status === PropertyStatus.RENTED ? 'bg-blue-100 text-blue-700' : 
//               'bg-gray-100 text-gray-700'
//             }`}>{property.status}</span>
//           </DialogDescription>
//         </DialogHeader>

//         {/* Large Image Preview */}
//         {selectedImage && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={() => setSelectedImage(null)}>
//             <div className="relative max-w-[95%] max-h-[95%]">
//               <button 
//                 className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setSelectedImage(null)
//                 }}
//               >
//                 ✕
//               </button>
//               <img 
//                 src={selectedImage} 
//                 alt="Large preview" 
//                 className="max-w-full max-h-[90vh] object-contain"
//               />
//             </div>
//           </div>
//         )}

//         <div className="grid gap-6 py-4">
//           {/* Images - with improved gallery layout */}
//           {property.imageUrls && property.imageUrls.length > 0 && (
//             <div className="space-y-2">
//               <h3 className="text-lg font-semibold">Images</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 {property.imageUrls.map((url, index) => (
//                   <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm" onClick={() => setSelectedImage(url)}>
//                     <img 
//                       src={url} 
//                       alt={`Property image ${index + 1}`} 
//                       className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
//                       <span className="text-white text-sm font-medium px-3 py-1 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">View</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Content in tabs or accordion for better organization */}
//           <div className="space-y-6">
//             {/* Basic Information */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Basic Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Type</p>
//                   <p>{property.type}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Status</p>
//                   <p>{property.status}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Year Built</p>
//                   <p>{property.yearBuilt || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Admin Note</p>
//                   <p>{property.adminNote || "N/A"}</p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Description */}
//             {property.description && (
//               <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="text-lg font-semibold flex items-center">
//                   <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                   Description
//                 </h3>
//                 <p className="text-sm">{property.description}</p>
//               </div>
//             )}

//             {/* Location */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Location
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Address</p>
//                   <p>{property.location.address}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">City</p>
//                   <p>{property.location.city}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">District</p>
//                   <p>{property.location.district}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Ward</p>
//                   <p>{property.location.ward || "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Owner Information */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Owner Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Name</p>
//                   <p>{property.owner.name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Phone</p>
//                   <p>{property.owner.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Email</p>
//                   <p>{property.owner.email || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Address</p>
//                   <p>{property.owner.address || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Nationality</p>
//                   <p>{property.owner.nationality || "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Property Details */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Property Details
//               </h3>
//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Bedrooms</p>
//                   <p>{property.propertyDetails.bedrooms || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Bathrooms</p>
//                   <p>{property.propertyDetails.bathrooms || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Living Rooms</p>
//                   <p>{property.propertyDetails.livingRooms || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Kitchens</p>
//                   <p>{property.propertyDetails.kitchens || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Land Area</p>
//                   <p>{property.propertyDetails.landArea ? `${property.propertyDetails.landArea} m²` : "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Building Area</p>
//                   <p>{property.propertyDetails.buildingArea ? `${property.propertyDetails.buildingArea} m²` : "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Number of Floors</p>
//                   <p>{property.propertyDetails.numberOfFloors || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Floor Number</p>
//                   <p>{property.propertyDetails.floorNumber || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Orientation</p>
//                   <p>{property.propertyDetails.apartmentOrientation || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Furnished</p>
//                   <p>{property.propertyDetails.furnished ? "Yes" : "No"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Has Basement</p>
//                   <p>{property.propertyDetails.hasBasement ? "Yes" : "No"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Price Details */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Price Details
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Sale Price</p>
//                   <p>{formatCurrency(property.priceDetails.salePrice, property.priceDetails.currency)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Rental Price</p>
//                   <p>{formatCurrency(property.priceDetails.rentalPrice, property.priceDetails.currency)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Price Per m²</p>
//                   <p>{formatCurrency(property.priceDetails.pricePerSquareMeter, property.priceDetails.currency)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Deposit Amount</p>
//                   <p>{formatCurrency(property.priceDetails.depositAmount, property.priceDetails.currency)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Maintenance Fee</p>
//                   <p>{formatCurrency(property.priceDetails.maintenanceFee, property.priceDetails.currency)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Currency</p>
//                   <p>{property.priceDetails.currency}</p>
//                 </div>
//               </div>
//               {property.priceDetails.paymentMethods && property.priceDetails.paymentMethods.length > 0 && (
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Payment Methods</p>
//                   <p>{property.priceDetails.paymentMethods.join(", ")}</p>
//                 </div>
//               )}
//             </div>

//             {/* Amenities */}
//             {property.amenities && (
//               <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="text-lg font-semibold flex items-center">
//                   <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                   Amenities
//                 </h3>
//                 <div className="grid grid-cols-3 gap-2">
//                   {property.amenities.parking !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.parking ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Parking</p>
//                     </div>
//                   )}
//                   {property.amenities.elevator !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.elevator ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Elevator</p>
//                     </div>
//                   )}
//                   {property.amenities.swimmingPool !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.swimmingPool ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Swimming Pool</p>
//                     </div>
//                   )}
//                   {property.amenities.gym !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.gym ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Gym</p>
//                     </div>
//                   )}
//                   {property.amenities.securitySystem !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.securitySystem ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Security System</p>
//                     </div>
//                   )}
//                   {property.amenities.airConditioning !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.airConditioning ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Air Conditioning</p>
//                     </div>
//                   )}
//                   {property.amenities.balcony !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.balcony ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Balcony</p>
//                     </div>
//                   )}
//                   {property.amenities.garden !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.garden ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Garden</p>
//                     </div>
//                   )}
//                   {property.amenities.playground !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.playground ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Playground</p>
//                     </div>
//                   )}
//                   {property.amenities.backupGenerator !== undefined && (
//                     <div className="flex items-center gap-2">
//                       <div className={`w-4 h-4 rounded-full ${property.amenities.backupGenerator ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <p>Backup Generator</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Contact Information */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Contact Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Contact Name</p>
//                   <p>{property.contactName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
//                   <p>{property.contactPhone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
//                   <p>{property.contactEmail || "N/A"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Documents with improved styling */}
//           {property.legalDocumentUrls && property.legalDocumentUrls.length > 0 && (
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Legal Documents
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {property.legalDocumentUrls.map((url, index) => (
//                   <div key={index} className="border p-3 rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-5 w-5 text-blue-500" />
//                       <span className="truncate max-w-[200px]">{getFileName(url)}</span>
//                     </div>
//                     <div className="flex gap-2">
//                       {isPdfFile(url) && (
//                         <a 
//                           href={url} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1 transition-colors"
//                         >
//                           View <ExternalLink className="h-3 w-3" />
//                         </a>
//                       )}
//                       {isImageFile(url) && (
//                         <button 
//                           onClick={() => setSelectedImage(url)}
//                           className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
//                         >
//                           Preview
//                         </button>
//                       )}
//                       <a 
//                         href={url} 
//                         download
//                         className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//                       >
//                         Download
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Transaction History */}
//           {property.transactionHistory && property.transactionHistory.length > 0 && (
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-lg font-semibold flex items-center">
//                 <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//                 Transaction History
//               </h3>
//               <div className="grid grid-cols-1 gap-2">
//                 {property.transactionHistory.map((transaction, index) => (
//                   <div key={index} className="border p-3 rounded-md">
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">Transaction Type</p>
//                         <p>{transaction.transactionType}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">Date</p>
//                         <p>{new Date(transaction.transactionDate).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">Price</p>
//                         <p>{formatCurrency(transaction.price, property.priceDetails.currency)}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
//                         <p>{transaction.transactionId}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Dates */}
//           <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//             <h3 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
//               Dates
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Created At</p>
//                 <p>{new Date(property.createdAt).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Updated At</p>
//                 <p>{new Date(property.updatedAt).toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// } 