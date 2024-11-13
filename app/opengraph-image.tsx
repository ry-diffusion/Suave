import { ImageResponse } from 'next/og'


// Image metadata
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: '#121212',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',

                }}
            >
                <h1 style={
                    {
                        fontSize: 24,
                        background: 'black',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'transparent',
                        backgroundImage: 'linear-gradient(140deg, #D2A8FF 12.09%, #F778BA 42.58%, #FF7B72 84.96%)',
                        backgroundClip: 'text',
                    }
                }>
                    Bem vindo ao Suave
                </h1>

                <p style={{
                    color: 'white',
                    fontSize: 12,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    padding: 8,

                }}> Por Moizes J. Sousa </p>

            </div>
        ),
        // ImageResponse options
        {
            // For convenience, we can re-use the exported icons size metadata
            // config to also set the ImageResponse's width and height.
            ...size,


        }
    )
}