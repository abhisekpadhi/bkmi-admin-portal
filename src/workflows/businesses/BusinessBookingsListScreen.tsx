import Box from '@mui/material/Box';
import {useEffect, useState} from 'react';
import {
    getAllBiz,
    getBookingsByDate,
    TBookingsOnDate,
    TBookingsOnDateResponse,
    TBusiness, TServices
} from '@/src/workflows/businesses/api';
import {notify} from '@/src/common/lib/utils';
import _ from 'lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import ProgressIndicator from '@/src/common/components/ProgressIndicator';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Button, TextField} from '@mui/material';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {flexColumnCenter} from '@/styles/common-styles';

function BookingListTable(props: {rows: {id: string; status: string; services: string; note: string, email: string; name: string;}[]}) {
    const {rows} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{backgroundColor: '#e1e1e1'}}>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">Services</TableCell>
                        <TableCell align="left">Note</TableCell>
                        <TableCell align="left">Email</TableCell>
                        <TableCell align="left">Name</TableCell>
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
                            <TableCell align="left">{row.status}</TableCell>
                            <TableCell align="left"> {row.services}</TableCell>
                            <TableCell align="left">{row.note}</TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function BusinessBookingsListScreen(props: { businessId: string }) {
    const {businessId} = props;
    const [fetching, setFetching] = useState(false);
    const [data, setData] = useState<TBookingsOnDate[]>([]);
    const [dt, setDt] = useState(dayjs().valueOf())

    const fetchData = async () => {
        try {
            const date = dayjs(dt).format('YYYY-MM-DD')
            console.log('date', date);
            setFetching(true);
            const res = await getBookingsByDate({businessId, date});
            console.log('res', res);
            setFetching(false);
            if (res.status) {
                setData((prev) => (_.unionBy([...(res?.data?.res ?? []), ...data], o => (o?._id ?? ''))))
                notify({message: 'Data fetched', severity: 'success'})
            } else  {
                notify({message: 'Failed to fetch businesses', severity: 'warn'});
                console.error(res)
            }
        } catch (e) {
            notify({message: 'Failed to fetch businesses', severity: 'error'});
            setFetching(false);
            console.error(e)
        }
    }
    const constructServicesDisplay = (payload: TServices) => {
        return payload.serviceDetails.name + '\n' + dayjs(payload.start).format('DD/MM/YYYY') + '(' + payload.serviceDetails.duration.hours + 'hrs ' + payload.serviceDetails.duration.minutes + 'mins' + ')';
    }
    const getRows = () => {
        return data.map(o => ({id: o.bookingId.toString(), status: o.status, services: constructServicesDisplay(o.services), note: o.note, email: o.email, name: o.name}));
    };
    if (fetching) {
        return (
            <Box sx={{...flexColumnCenter, height: '100vh'}}>
                <ProgressIndicator />
            </Box>
        )
    }
    const router = useRouter();
    return (
        <Box
            sx={{
                // ...flexColumnleft,
                height: '100vh',
            }}
        >
            <a onClick={() => router.back()} style={{paddingBottom: '10px', color: 'blue'}}>👈 Back to biz list</a>
            <h2 style={{padding: '10px'}}>Bookings</h2>
            <Box marginY={2}>
                <DatePicker
                    label="Date"
                    value={dayjs(dt)}
                    onChange={(newValue) => {
                        if (newValue !== null) {
                            setDt(newValue.valueOf());
                        } else {
                            notify({message: 'Date value is invalid', severity: 'warn'})
                        }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Button variant={'contained'} style={{marginLeft: 20}} onClick={fetchData}> Fetch bookings </Button>
            </Box>

            <BookingListTable rows={getRows()} />

        </Box>
    )
}
