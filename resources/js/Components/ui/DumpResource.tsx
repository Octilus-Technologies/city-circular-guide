import React, { ReactNode } from 'react';

function DumpResource({ data }: { data: Record<string, ReactNode | any> }) {
    return (
        <table className='table table-zebra'>
            <tbody>
                {(Object.keys(data) as Array<keyof typeof data>).map((key) => (
                    <tr key={`data-${key}`}>
                        <td className="opacity-80">
                            {key.replace(/\b\w/g, l => l.toUpperCase()).replace(/_/g, ' ')}
                        </td>

                        <td className="">
                            <span className='whitespace-pre-wrap'>
                                {typeof data?.[key] === 'boolean' ? (data?.[key] ? 'Yes' : 'No') : data?.[key] ?? 'N/A'}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DumpResource;