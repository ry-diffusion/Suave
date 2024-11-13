import { ImageResponse } from 'next/og'


// Image metadata
export const size = {
    width: 600,
    height: 200,
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',

                    border: '1px solid #505050',
                }}
            >
                <h1 style={
                    {
                        fontSize: 32,
                        color: 'transparent',
                        backgroundImage: 'linear-gradient(140deg, #D2A8FF 12.09%, #F778BA 42.58%, #FF7B72 84.96%)',
                        backgroundClip: 'text',
                    }
                }>
                    Suave - Sua ferramenta do IF
                </h1>

                <p style={{
                    color: '#525252',
                    fontSize: 20,

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