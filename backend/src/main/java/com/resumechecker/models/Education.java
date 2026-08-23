package com.resumechecker.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "educations")
@Getter
@Setter
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    private String institution;
    
    @Column(length = 100)
    private String degree;
    
    @Column(length = 100)
    private String field;
    
    @Column(name = "graduation_year")
    private Integer graduationYear;
}
