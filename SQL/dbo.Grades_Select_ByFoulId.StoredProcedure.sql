USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Grades_Select_ByFoulId]    Script Date: 4/14/2023 7:47:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 4/10/2023
-- Description:Select By FoulId from dbo.Grades 
--			Join dbo.GradeTypes, dbo.Grades, and dbo.StatusTypes
--			    
--Params:	@PageIndex int
--			,@PageSize int
--			@FoulId int 
-- Code Reviewer: Mason Doherty

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Grades_Select_ByFoulId]
						@PageIndex int
						,@PageSize int
						,@FoulId int

as
/*
	declare @PageIndex int = 0
			,@PageSize int = 10
			,@FoulId int = 5

	execute [dbo].[Grades_Select_ByFoulId] 
									@PageIndex
									,@PageSize
									,@FoulId

*/
BEGIN

	Declare @offset int = @PageIndex * @PageSize

	SELECT g.[Id]
		  ,g.[FoulId]
		  ,g.[Comment]
		  ,u.[Id]
		  ,u.[FirstName]
		  ,u.[LastName]
		  ,u.[Mi]
		  ,u.[AvatarUrl]
		  ,us.[Id]
		  ,us.[FirstName]
		  ,us.[LastName]
		  ,us.[Mi]
		  ,us.[AvatarUrl]
		  ,g.[DateCreated]
		  ,g.[DateModified]		 
		  ,s.[Id]
		  ,s.[Name]
		  ,gt.[Id]
		  ,gt.[Name]
		  ,gt.[Code]
		  ,gt.[IsReplay]
		  ,[TotalCount] = COUNT(1) OVER ()
	from [dbo].[Grades] as g inner join dbo.StatusTypes as s
		on g.[StatusId] = s.[Id]
	inner join dbo.GradeTypes as gt
		on g.[GradeTypeId] = gt.[Id]
	inner join dbo.Users as u
		on u.[Id] = g.[CreatedBy] 
	inner join dbo.Users as us 
		on us.[Id] = g.[ModifiedBy]
	where g.[FoulId] = @FoulId
	Order By g.[Id]

	OFFSET @offset Rows
	Fetch Next @PageSize Rows ONLY

END


GO
