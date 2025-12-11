import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing'; // ایمپورت از فایل کنار دستش

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);