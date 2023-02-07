import Box from '@mui/material/Box';
import {useEffect, useState} from 'react';
import {getAllBiz, TBusiness} from '@/src/workflows/businesses/api';
import {notify} from '@/src/common/lib/utils';
import _ from 'lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button, CircularProgress} from '@mui/material';
import ProgressIndicator from '@/src/common/components/ProgressIndicator';
import {router} from 'next/client';
import {flexColumnCenter} from '@/styles/common-styles';

function BizListTable(props: {rows: {id: string; name: string; address: string; phone: string; description: string}[], onClick: (id: string) => void;}) {
    const {rows} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{backgroundColor: '#e1e1e1'}}>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Address</TableCell>
                        <TableCell align="left">Phone</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="left">  </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left"> {row.address}</TableCell>
                            <TableCell align="left">{row.phone}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">
                                <Button onClick={() => props.onClick(row.id)} variant={'contained'}>Bookings</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function BusinessesListScreen() {
    const [fetching, setFetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [data, setData] = useState<TBusiness[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const fetchData = async () => {
        const limit = 100
        try {
            offset !== 0 ? setFetchingMore(true) : setFetching(true);
            const res = await getAllBiz({skip: offset, limit});
            offset !== 0 ? setFetchingMore(false) : setFetching(false);
            if (res.status) {
                setData((prev) => (_.unionBy([...(res?.data ?? []), ...data], o => (o?._id ?? ''))))
                const hasMore = (res.data ?? []).length === limit;
                hasMore && setOffset(prev => prev + limit);
                setHasMore(hasMore);
                notify({message: 'Data fetched', severity: 'success'})
            } else  {
                notify({message: 'Failed to fetch businesses', severity: 'warn'});
                console.error(res)
            }
        } catch (e) {
            notify({message: 'Failed to fetch businesses', severity: 'error'});
            offset !== 0 ? setFetchingMore(false) : setFetching(false);
            console.error(e)
        }
    }
    useEffect(() => {
        fetchData().then(_ => {});
    }, []);
    const getRows = () => {
        return data.map(o => ({
            id: o._id,
            name: o.businessName,
            address: `${o.address.addressLine1} ${o.address.addressLine2} ${o.address.city} ${o.address.postCode}`,
            phone: o.businessMobile,
            description: o.description
        }));
    };
    if (fetching) {
        return (
            <Box sx={{...flexColumnCenter, height: '100vh'}}>
                <ProgressIndicator />
            </Box>
        )
    }
    return (
        <Box
            sx={{
                // ...flexColumnleft,
                height: '100vh',
            }}
        >
            <h2 style={{padding: '10px'}}>Businesses list</h2>

            <BizListTable rows={getRows()} onClick={(id: string) => {router.push('/app/businesses/' + id)}} />

            {hasMore && (<Box marginY={2} textAlign={'left'}>
                {fetchingMore ? (
                    <CircularProgress/>
                ) : (
                    <Button variant={'outlined'} color={'primary'}>
                        Load more
                    </Button>
                )}
            </Box>)}

        </Box>
    )
}
