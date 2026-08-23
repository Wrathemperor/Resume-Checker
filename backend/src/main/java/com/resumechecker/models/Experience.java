package com.resumechecker.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "experiences")
@Getter
@Setter
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    private String company;
    private String role;
    
    @Column(name = "start_date", length = 20)
    private String startDate;
    
    @Column(name = "end_date", length = 20)
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;
}
