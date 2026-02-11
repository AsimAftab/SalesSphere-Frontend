export const CustomMarker = () => (
    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
        <div style={{
            width: '32px', height: '32px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)', border: '3px solid white',
        }} />
        <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: '12px', height: '12px', background: 'white', borderRadius: '50%',
        }} />
    </div>
);
