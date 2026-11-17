import React, { useContext, useEffect, useState } from 'react'
import Dropzone from 'shadcn-dropzone'
import useExcelConverter from '../../hooks/useExcelConverter';
import { Button } from '../../components/ui/button';
import { CloudUpload } from 'lucide-react';
import { uploadBatchClientIds, uploadClientIdsExcelfile } from '../../utils/clientids';
import { AppContext } from '../../context/AppContext';
import { toast } from 'sonner';
import axios from 'axios';

const ExcelUploadDialog = () => {

    const { token, refreshRecord } = useContext(AppContext)
    const [success, setSuccess] = useState()
    const [error, setError] = useState()
    const [uploading, setUploading] = useState(false)
    const { data, loading, convertToJson, clearData } = useExcelConverter();
    const [file, setFile] = useState(null)
    const [importId, setImportId] = useState(null);
    const [progress, setProgress] = useState(null);
    const API_BASE = import.meta.env.VITE_BASE_URL

    const handleFileDrop = async (acceptedFiles) => {
        //setIsDialogOpen(true);
        // This function is called when files are dropped or selected
        //console.log("Files received:", acceptedFiles[0]);
        setFile(acceptedFiles[0]);
        /**const file = acceptedFiles[0];

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
        }*/
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select an Excel file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        
        console.log(formData)
        //uploadBatchClientIds(token, { data }, setSuccess, setError, setUploading)
        uploadClientIdsExcelfile(token, formData, setSuccess, setError, setUploading)
    }

    if(success){
        toast.success(success.message+' fpr '+success.total_rows+' records', {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setImportId(success.import_id);
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {

        if (!importId) return;

        let active = true;
        let timer;

        const checkProgress = async () => {
            try {
                const token = localStorage.getItem('authToken');
                
                const response = await axios.get(
                    `${API_BASE}/import-progress/${importId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
        
                if (!active) return;
        
                setProgress(response.data);
        
                if (
                    response.data.status === "completed" ||
                    response.data.status === "failed"
                ) {
                    clearInterval(timer);
                }
        
            } catch (error) {
                console.error("Progress check failed", error);
            }
        };

        checkProgress();

        timer = setInterval(checkProgress, 3000);

        return () => {
            active = false;
            clearInterval(timer);
        };

    }, [importId]);

    return (
        <div className='grid gap-4'>
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
                <Button
                    type="submit"
                    className="flex items-center gap-1 bg-gradient-to-br from-accent to-brand hover:from-accent/70 hover:to-brand/70"
                    disabled={uploading}
                >
                    <CloudUpload className='!w-5 !h-5' />
                    <span>Upload</span>
                </Button>
            }
            {
                uploading ? <span className='text-green-600 italic'>Submitting data...</span> :
                (success && <span className='text-brand italic'>Uploaded!</span>)
            }
            </form>

            {progress && (
                <div>

                    <h3>
                        Import Progress
                    </h3>

                    <div className="w-full bg-gray-200 rounded-full h-4 mt-3">

                        <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{
                                width: `${progress.percentage}%`
                            }}
                        />

                    </div>

                    <p className="mt-2">
                        {progress.percentage}% completed
                    </p>

                    <p>
                        Processed: {
                            progress.processed_rows.toLocaleString()
                        } / {
                            progress.total_rows.toLocaleString()
                        }
                    </p>

                    <p>
                        Failed: {
                            progress.failed_rows.toLocaleString()
                        }
                    </p>

                    <p>
                        Status: {progress.status}
                    </p>

                    {progress.error_message && (
                        <p className="text-red-500">
                            {progress.error_message}
                        </p>
                    )}

                </div>
            )}
        </div>
    )
}

export default ExcelUploadDialog