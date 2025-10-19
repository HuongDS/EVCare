import React from "react";
import type { EmployeeSkill } from "../../../../models/Employee/EmployeeSkill";
import type { EmployeeSkillCategoryViewModel } from "../../../../models/Employee/EmployeeSkillCategoryViewModel";

interface SkillsSectionProps {
  skillGroups: EmployeeSkillCategoryViewModel[];
  selectedSkills: EmployeeSkill[];
  setSelectedSkills: (v: EmployeeSkill) => void;
  setSearchSkills: (v: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillGroups,
  selectedSkills,
  setSelectedSkills,
  setSearchSkills,
}) => {
  const toggleSkill = (skill: EmployeeSkill) => {
    setSelectedSkills(skill);
  };

  return (
    <div className="skills-section">
      <label className="form-label">
        Technical Skills<span className="required">*</span>
      </label>

      <div className="skills-search">
        <input
          type="text"
          className="form-input"
          id="skillsSearchInput"
          placeholder="Search skills by name or description..."
          onChange={(e) => setSearchSkills(e.target.value)}
        />
      </div>

      <div className="skills-groups">
        {skillGroups.map((group) => (
          <div className="skill-group" key={group.id}>
            <div className="skill-group-header">
              <span>{group.name}</span>
            </div>

            <div className="skill-group-body">
              {group.services.map((skill) => {
                const id = `skill-${skill.id}-${skill.name}`;
                return skill.isDeleted ? (
                  <></>
                ) : (
                  <div className="skill-checkbox-wrapper" key={id}>
                    <input
                      type="checkbox"
                      className="skill-checkbox"
                      id={id}
                      value={skill.id}
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                    />
                    <label className="skill-label" htmlFor={id}>
                      {skill.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="selected-skills-display">
        <div className="selected-label">Selected Skills:</div>
        <div className="selected-skills-list">
          {selectedSkills.length > 0 ? (
            selectedSkills.map((skill) => (
              <span key={skill.id} className="selected-skill-tag">
                {skill.name}
              </span>
            ))
          ) : (
            <span className="no-skills-text">No skills selected yet</span>
          )}
        </div>
      </div>
    </div>
  );
};
