import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariants = {
  rest: { scale: 1, boxShadow: "0 6px 18px rgba(46,26,71,0.06)" },
  hover: { scale: 1.02, boxShadow: "0 12px 30px rgba(46,26,71,0.12)" }
};

const ProviderCard = ({ provider }) => {
  return (
    <motion.div className="card provider-card" initial="rest" whileHover="hover" animate="rest" variants={cardVariants}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <h3 style={{margin:0}}>{provider.name}</h3>
          <div className="meta">{provider.speciality || "Workshop Provider"}</div>
          <div className="text-muted small">{provider.location || "Unknown location"}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:20, fontWeight:700, color:"var(--primary-purple)"}}>{provider.rating || "★ 4.5"}</div>
        </div>
      </div>

      <div style={{display:"flex", justifyContent:"flex-end", gap:10}}>
        <Link to={`/book-provider/${provider.id}`} className="btn secondary">View / Book</Link>
      </div>
    </motion.div>
  );
};

export default ProviderCard;
