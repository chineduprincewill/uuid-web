import React, { useContext, useState } from 'react'
import Dropzone from 'shadcn-dropzone'
import useExcelConverter from '../../hooks/useExcelConverter';
import { Button } from '../../components/ui/button';
import { CloudUpload } from 'lucide-react';
import { uploadBatchClientIds } from '../../utils/clientids';
import { AppContext } from '../../context/AppContext';
import { toast } from 'sonner';

const ExcelUploadDialog = () => {

    const { token, refreshRecord } = useContext(AppContext)
    const [success, setSuccess] = useState()
    const [error, setError] = useState()
    const [uploading, setUploading] = useState(false)
    const { data, loading, convertToJson, clearData } = useExcelConverter();

    const handleFileDrop = async (acceptedFiles) => {
        //setIsDialogOpen(true);
        // This function is called when files are dropped or selected
        //console.log("Files received:", acceptedFiles[0]);
        //setFile(acceptedFiles[0]);
        const file = acceptedFiles[0];

        if (file) {
            try {
              await convertToJson(file, {
                header: 0,        // Use first row as header
                defval: '',       // Empty cells become empty string
                blankrows: false  // Skip blank rows
              });
            } catch (err) {
              console.error('Conversion failed:', err);
            }
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        
        //console.log(data)
        uploadBatchClientIds(token, { data }, setSuccess, setError, setUploading)
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form className='grid gap-4' onSubmit={handleUpload}>
            <Dropzone onDrop={handleFileDrop}>
            {({ getRootProps, getInputProps, isDragAccept, acceptedFiles }) => (
                <div
                {...getRootProps()}
                className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${
                    isDragAccept ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
                >
                    <input {...getInputProps()} />
                    {isDragAccept ? (
                        <p className="text-green-600">Drop your files here...</p>
                    ) : (
                        <p className='text-sm'>Click to select Client ids excel document</p>
                    )}
                    <div className='flex justify-center items-center mt-2'>
                        {acceptedFiles.length > 0 ? 
                            <span className="text-sm text-gray-500 mt-0">
                            {acceptedFiles[0]?.name} file selected
                            </span>
                            : <span>...</span>
                        }
                    </div>
                </div>
            )}
            </Dropzone>
        {
            loading ? <span className='text-green-600 italic'>Loading data...</span> :
            data && !loading && 
            <div className='flex items-center justify-between'>
                <span className='text-brand italic'>Loading completed!</span>
                <Button
                    type="submit"
                    className="flex items-center gap-1 bg-transparent border-none hover:bg-brand/10 text-brand"
                    disabled={loading}
                >
                    <CloudUpload className='!w-5 !h-5' />
                    <span>Upload</span>
                </Button>
            </div>
        }
        {
            uploading ? <span className='text-green-600 italic'>Submitting data...</span> :
            (success && <span className='text-brand italic'>Uploaded!</span>)
        }
        </form>
    )
}

export default ExcelUploadDialog