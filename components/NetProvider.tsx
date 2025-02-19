'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import {queryClient} from "@/lib/query";

export default function NetProvider({ children }: { children: React.ReactNode }) {

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
