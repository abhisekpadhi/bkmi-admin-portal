import Link from 'next/link';
import Container from '@mui/material/Container';

export default function FourOhFour() {
    return (
        <Container sx={{ p: 10 }}>
            <h1>404 - Page Not Found</h1>
            <Link href="/app">
                <span style={{ color: 'blue' }}>🏡 Go back home</span>
            </Link>
        </Container>
    );
}
