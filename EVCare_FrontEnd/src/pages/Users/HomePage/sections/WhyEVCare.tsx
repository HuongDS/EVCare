"use client";

import type { Variants } from "framer-motion";
import { FaBolt, FaTools, FaStethoscope } from "react-icons/fa";
import {
  Container,
  Title,
  CardList,
  CardItem,
  CardIcon,
  CardCategory,
  CardTitle,
} from "./Style/WhyEVCare.styled";

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function WhyEVCare() {
  const cards = [
    {
      category: "Diagnostics",
      title: "High-Voltage Battery Check",
      icon: <FaStethoscope />,
    },
    {
      category: "Performance",
      title: "Software & System Updates",
      icon: <FaBolt />,
    },
    {
      category: "Maintenance",
      title: "Tire & Brake Service",
      icon: <FaTools />,
    },
  ];

  return (
    <Container>
      <Title>Why Smart EV Care Matters</Title>

      <CardList
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={listVariants}
      >
        {cards.map((card, index) => (
          <CardItem key={index} variants={itemVariants}>
            <CardIcon>{card.icon}</CardIcon>
            <div>
              <CardCategory>{card.category}</CardCategory>
              <CardTitle>{card.title}</CardTitle>
            </div>
          </CardItem>
        ))}
      </CardList>
    </Container>
  );
}
