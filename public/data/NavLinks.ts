import { Link } from "@/interfaces/Link";
import { DEBUG } from "@/config";

export const Links: Link[] = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'NBA',
        path:       DEBUG
        ? "http://localhost:3000/sportsPicker/NBA"
        : "https://victorsingh.ca/sportsPicker/NBA"
    },
    {
        name: 'NFL',
        path: '/NBA'
    },
    {
        name: 'Search',
        path: '/search'
    }
]