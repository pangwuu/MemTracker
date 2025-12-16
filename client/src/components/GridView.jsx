import { NavLink } from "react-router";
import MemoryCard from "./MemoryCard";

export default function GridView(memories) {
    return <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(400px, 100%), 1fr))',
        gap: '10px'
    }}>
        {memories.map((memory, index) => <NavLink to={`/memoryDetailed/${memory.mem_id}`} style={{ textDecoration: 'none' }} key={index}>
            <MemoryCard key={index} memory={memory} />
        </NavLink>
        )}
    </div>;
}
