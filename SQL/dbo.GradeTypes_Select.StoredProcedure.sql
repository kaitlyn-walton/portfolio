USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[GradeTypes_Select]    Script Date: 4/17/2023 6:01:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 4/14/2023
-- Description:Update dbo.Grades
--			    
--Params:		
-- Code Reviewer: Mason Doherty

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note: I was instructed by Danny to add this proc
--
-- =============================================

CREATE proc [dbo].[GradeTypes_Select]
			@IsReplay nvarchar(10)

as
/*
	Declare @IsReplay nvarchar(10) = all
	Execute dbo.GradeTypes_Select @IsReplay
*/
BEGIN

	If @IsReplay = 'true'
		Select	[Id]
				,[Name]
				,[Code]
				,[IsReplay]
		From [dbo].[GradeTypes]
		Where [IsReplay] = 1
	If @IsReplay = 'false'
		Select	[Id]
				,[Name]
				,[Code]
				,[IsReplay]
		From [dbo].[GradeTypes]
		Where [IsReplay] = 0
	If @IsReplay = 'all'
		Select	[Id]
				,[Name]
				,[Code]
				,[IsReplay]
		From [dbo].[GradeTypes]

END
GO
