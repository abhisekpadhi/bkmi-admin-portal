import type {NextPage} from 'next';
import BusinessBookingsListScreen from '@/src/workflows/businesses/BusinessBookingsListScreen';
import {useRouter} from 'next/router';

const BusinesBookingsPage: NextPage = () => {
    const router = useRouter();
    const { businessId } = router.query;
    console.log('bizId', businessId);
    return ((businessId ?? '').length > 0 ? <BusinessBookingsListScreen businessId={businessId as string} /> : <></>)
};

export default BusinesBookingsPage;
