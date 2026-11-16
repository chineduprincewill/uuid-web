import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { fetchClientids, fetchWebFormfields, getClientFacilites } from '../../utils/clientids'
import { generateColumns } from './columns'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'
import { Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import ExcelUploadDialog from './excel-upload-dialog'
import { useNavigate } from 'react-router-dom'
import ComboboxComponent from '../../components/combobox-component'
import { Button } from '../../components/ui/button'

const Clientids = () => {
    const { token, record } = useContext(AppContext)
    
    const navigate = useNavigate();
    // 1. Initialize with empty arrays to prevent undefined errors
    const [clientids, setClientids] = useState([]);
    const [formfields, setFormfields] = useState([]);
    const [error, setError] = useState(null);
    
    // 2. Separate loading states for precision
    const [loadingData, setLoadingData] = useState(true);
    const [loadingFields, setLoadingFields] = useState(true);

    const [options, setOptions] = useState([]);
    const [facility, setFacility] = useState(null)
    const [loading, setLoading] = useState(false)

    // 3. Only generate columns if formfields has items
    const columns = formfields.length > 0 ? generateColumns(formfields) : [];

    // 4. Safely generate filters
    const generateDatafilters = () => {
        // 1. Define the static filters that match your static columns
        const staticFilters = [
            { title: 'uid', placeholder: 'UID' },
        ];
    
        // 2. Safely map the dynamic form fields
        const dynamicFilters = (formfields && formfields.length > 0) 
            ? formfields.map((fmf) => ({
                title: fmf.field_name,
                placeholder: fmf.display_name
            })) 
            : [];
    
        // 3. Combine and return
        return [...staticFilters, ...dynamicFilters];
        //return [...dynamicFilters];
    };

    useEffect(() => {
        getClientFacilites(token, setOptions, setError, setLoading)
    }, [facility])

    useEffect(() => {
        // Assuming your fetch functions accept the setter functions
        fetchClientids(token, { facility }, setClientids, setError, setLoadingData)
        fetchWebFormfields(token, { form_id: "cidlink" }, setFormfields, setError, setLoadingFields)
    }, [token, record, facility]) // Added token to dependency array

    // 5. Determine if we should show the skeleton
    // Show skeleton if either is loading, OR if data is empty but no error occurred
    const isLoading = loadingData || loadingFields;
    const isReady = clientids.length > 0 && columns.length > 0;

    return (
        <div className='w-full p-6'>
            <div className='grid gap-4'>
                <div className='w-full flex px-3 py-2 justify-between items-center bg-card rounded-lg'>
                    <ComboboxComponent comboOptions={options} value={facility} setValue={setFacility} placeholder="filter by facility" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <div 
                                className='flex gap-1 items-center cursor-pointer rounded-full px-3 py-1 hover:bg-foreground/10'
                            >
                                <Upload className='!w-4 !h-4' />
                                <span className='font-extralight text-sm'>Excel</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight">Upload excel document</DialogTitle>
                            <ExcelUploadDialog />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className='w-full p-6 bg-card rounded-lg overflow-auto'>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    
                    {isLoading ? (
                        <SkeletonComponent />
                    ) : isReady ? (
                        <DataTable 
                            data={clientids} 
                            columns={columns} 
                            filterArrs={generateDatafilters()} 
                        />
                    ) : (
                        <div 
                            className="grid gap-2 p-4 rounded-xl border border-accent/50 bg-accent/10 hover:bg-accent/20 text-white"
                        >
                            <span className='text-lg md:text-4xl font-extralight'>Client IDs are loaded here</span>
                            <span className='text-lg'>You must select a facility above to load its clients IDs</span>
                            <span className='text-lg text-brand font-extralight'>However, if you have selected a facility and no record is loaded, it is either there is no record for the facility or your session has expired</span>
                            <Button 
                                variant="outline" 
                                className="!p-6 max-w-max bg-gradient-to-br from-accent to-brand"
                                onClick={() => navigate('/')}
                            >Click here to re-login if session has expired</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Clientids;