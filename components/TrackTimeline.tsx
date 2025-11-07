"use client";

import React from "react";
import type {
  ActionForDrawerT,
  UserReportDetailT,
  TimelineEntry,
} from "@/lib/types";
import { statusLabel } from "@/lib/statuses";

// MUI Timeline components
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Chip } from "@mui/material";

interface Props {
  report: UserReportDetailT;
}

export default function TrackTimeline({ report }: Props) {
  // Build timeline entries: report creation + actions
  const entries: TimelineEntry[] = [
    {
      key: `report-${report.id}`,
      title: "Report submitted",
      date: report.createdAt,
      body: report.description,
      attachments: report.files ?? [],
    },
    ...((report.actions as unknown as ActionForDrawerT[]) || []).map((a) => ({
      key: `action-${a.id}`,
      title: `Action by admin ${a.adminId}`,
      date: a.createdAt,
      body: a.note,
      status: a.statusChange,
      attachment: a.proofFile,
    })),
  ];
  //   entries.sort(
  //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  //   );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          textAlign: "center",
          mb: 4,
        }}
      >
        Timeline
      </Typography>

      <Timeline
        position="right"
        sx={{
          "&::before": {
            background:
              "linear-gradient(180deg, rgba(33,150,243,0.3) 0%, rgba(33,203,243,0.3) 100%)",
          },
        }}
      >
        {entries.map((e, idx) => (
          <TimelineItem key={e.key}>
            <TimelineOppositeContent
              sx={{
                m: "auto 0",
                flex: 0.3,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    display: "block",
                  }}
                >
                  {new Date(e.date).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem" }}
                >
                  {new Date(e.date).toLocaleTimeString()}
                </Typography>
              </Paper>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: e.status === 1 ? "#2196F3" : "#9E9E9E",
                  boxShadow: `0 0 0 4px ${
                    e.status === 1
                      ? "rgba(33, 150, 243, 0.2)"
                      : "rgba(158, 158, 158, 0.2)"
                  }`,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "white",
                  },
                }}
              />
              {idx < entries.length - 1 && (
                <TimelineConnector
                  sx={{
                    background:
                      "linear-gradient(180deg, #2196F3 0%, #21CBF3 100%)",
                    width: 2,
                  }}
                />
              )}
            </TimelineSeparator>

            <TimelineContent sx={{ py: "20px", px: 3 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 3,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: -8,
                    top: 24,
                    width: 0,
                    height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight: "8px solid #ffffff",
                    filter: "drop-shadow(-2px 0 2px rgba(0,0,0,0.1))",
                  },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Status Badge */}
                {e.status !== undefined && (
                  <Chip
                    label={statusLabel(Number(e.status))}
                    size="small"
                    color={
                      e.status === 1
                        ? "primary"
                        : e.status === 2
                        ? "secondary"
                        : e.status === 3
                        ? "success"
                        : e.status === 4
                        ? "warning"
                        : "default"
                    }
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      background:
                        e.status === 1
                          ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                          : "linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)",
                      color: "white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                )}

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "text.primary",
                  }}
                >
                  {e.title}
                </Typography>

                {/* Body */}
                {e.body && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {e.body}
                  </Typography>
                )}

                {/* Attachments */}
                {(e.attachments && e.attachments.length > 0) || e.attachment ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 1,
                        fontWeight: 600,
                        color: "text.secondary",
                      }}
                    >
                      Attachments:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {e.attachments?.map((f) => (
                        <Chip
                          key={f.id}
                          icon={<OpenInNewIcon />}
                          label={"View File"}
                          variant="outlined"
                          size="small"
                          clickable
                          component="a"
                          href={`https://srwksjrfrdwuudkuyfzz.supabase.co/storage/v1/object/public/Complaints/${report.trackingId}/reportFiles/${f.name}`}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "white",
                            },
                          }}
                        />
                      ))}

                      {e.attachment && (
                        <Chip
                          icon={<OpenInNewIcon />}
                          label="View Attachment"
                          variant="outlined"
                          size="small"
                          clickable
                          component="a"
                          href={e.attachment}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "white",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                ) : null}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}
